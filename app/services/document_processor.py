"""
Document Processing Pipeline for TaxSight
==========================================
Handles: upload → OCR → classify → extract → calculate deductions

Architecture:
- PyPDF2 for PDF text extraction (free, server-side)
- pdfplumber for structured table extraction from forms
- Pattern matching for W-2, 1099, and receipt classification
- Deduction engine for auto-detecting common deductions

Upgrade path: Swap local engines for Azure Document Intelligence
or AWS Textract when scaling.
"""

import re
import json
import logging
from pathlib import Path
from typing import Optional, Dict, List, Any, Tuple
from dataclasses import dataclass, field, asdict
from datetime import datetime

logger = logging.getLogger(__name__)

# ─── Data Models ────────────────────────────────────────────────────────────

@dataclass
class ExtractedField:
    name: str
    value: Any
    confidence: float  # 0.0 - 1.0
    source: str  # 'ocr', 'pattern', 'llm', 'manual'

@dataclass
class DocumentResult:
    filename: str
    document_type: str  # 'w2', '1099', 'receipt', 'other'
    document_subtype: Optional[str]  # 'nec', 'int', 'misc', 'div'
    tax_year: Optional[int]
    fields: List[ExtractedField] = field(default_factory=list)
    raw_text: str = ""
    extraction_method: str = "local"
    error: Optional[str] = None

@dataclass
class DeductionFinding:
    category: str
    description: str
    estimated_amount: float
    confidence: float
    source_field: Optional[str] = None

@dataclass
class ProcessingResult:
    document: DocumentResult
    deductions: List[DeductionFinding] = field(default_factory=list)
    processed_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


# ─── OCR Engine ─────────────────────────────────────────────────────────────

class OCREngine:
    """Extract text from uploaded documents."""

    @staticmethod
    def extract_text(file_path: str) -> Tuple[str, str]:
        """Extract text from PDF or image. Returns (text, method_used)."""
        path = Path(file_path)
        ext = path.suffix.lower()

        if ext == '.pdf':
            return OCREngine._extract_pdf(str(path))
        elif ext in ('.png', '.jpg', '.jpeg', '.tiff', '.bmp'):
            return OCREngine._extract_image(str(path))
        else:
            # Try as PDF anyway
            return OCREngine._extract_pdf(str(path))

    @staticmethod
    def _extract_pdf(file_path: str) -> Tuple[str, str]:
        """Extract text from PDF using multiple methods for best results."""
        text_parts = []
        methods_used = []

        # Method 1: PyPDF2 (fast, good for digital PDFs)
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(file_path)
            pages_text = []
            for page in reader.pages:
                t = page.extract_text() or ""
                pages_text.append(t)
            if pages_text and any(len(t) > 50 for t in pages_text):
                text_parts.append("\n".join(pages_text))
                methods_used.append("pypdf2")
        except Exception as e:
            logger.debug(f"PyPDF2 failed: {e}")

        # Method 2: pdfplumber (better for tables, structured forms)
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                tables_text = []
                body_text = []
                for page in pdf.pages:
                    # Extract tables first (W-2 boxes, 1099 line items)
                    tables = page.extract_tables()
                    for table in tables:
                        for row in table:
                            row_text = " | ".join(str(c or "") for c in row)
                            tables_text.append(row_text)
                    # Extract regular text
                    t = page.extract_text() or ""
                    body_text.append(t)
                if tables_text:
                    text_parts.insert(0, "=== TABLES ===\n" + "\n".join(tables_text))
                    methods_used.append("pdfplumber-tables")
                if body_text and any(len(t) > 20 for t in body_text):
                    text_parts.append("\n".join(body_text))
                    methods_used.append("pdfplumber")
        except Exception as e:
            logger.debug(f"pdfplumber failed: {e}")

        combined = "\n".join(text_parts)
        method = "+".join(methods_used) if methods_used else "none"
        return combined, method

    @staticmethod
    def _extract_image(file_path: str) -> Tuple[str, str]:
        """Extract text from image via OCR. Falls back cleanly if tesseract unavailable."""
        try:
            from PIL import Image
            import pytesseract
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)
            if text.strip():
                return text, "tesseract"
            return "", "tesseract-empty"
        except ImportError:
            return "", "tesseract-unavailable"
        except Exception as e:
            return "", f"tesseract-error:{str(e)[:50]}"


# ─── Document Classifier ────────────────────────────────────────────────────

class DocumentClassifier:
    """Identify document type from extracted text."""

    # W-2 patterns: employer box, wages, medicare wages, social security
    W2_PATTERNS = [
        r'Form\s*W-2', r'Wage and Tax Statement',
        r'(?:Box\s*)?(?:1|2|3|4|5|6|12|13|14|16|17|18)',
        r'Social security (?:wages|tax)',
        r'Medicare (?:wages|tax)',
        r'Federal income tax withheld',
        r'Employer\s*(?:identification|ID)\s*number',
        r"Employee's\s*(?:social\s*security|address|name)",
    ]

    # 1099 patterns
    NINE_99_PATTERNS = {
        'nec': [r'Form\s*1099-NEC', r'Nonemployee\s*Compensation'],
        'int': [r'Form\s*1099-INT', r'Interest\s*Income'],
        'misc': [r'Form\s*1099-MISC', r'Miscellaneous\s*Income'],
        'div': [r'Form\s*1099-DIV', r'Dividends'],
        'generic': [r'Form\s*1099', r'Payer\s*(?:information|name|ID)'],
    }

    # Receipt / invoice patterns
    RECEIPT_PATTERNS = [
        r'(?:Total|Amount|Balance)\s*(?:Due|Paid)?\s*[:$]?\s*\d+',
        r'(?:Receipt|Invoice|Bill|Order)\s*(?:#|No|Number)?',
        r'(?:Date|Purchased|Ordered|Transaction)\s*:?\s*\d+[/-]\d+',
        r'(?:Item|Product|Service|Description)',
        r'(?:Subtotal|Tax|Shipping|Discount)',
    ]

    @classmethod
    def classify(cls, text: str, filename: str) -> Tuple[str, Optional[str]]:
        """
        Classify document into type and subtype.
        Returns (document_type, document_subtype).
        Types: 'w2', '1099', 'receipt', 'unknown'
        """
        text_lower = text.lower()
        name_lower = filename.lower()

        # Check filename hints first (fast path)
        if 'w2' in name_lower or 'w-2' in name_lower:
            return 'w2', None
        if '1099' in name_lower:
            for subtype, patterns in cls.NINE_99_PATTERNS.items():
                for p in patterns:
                    if re.search(p.replace(r'\s*', ''), name_lower.replace(' ', '')):
                        return '1099', subtype if subtype != 'generic' else None
            return '1099', None  # default 1099
        if any(kw in name_lower for kw in ['receipt', 'invoice', 'bill']):
            return 'receipt', None

        # Content-based classification
        w2_score = sum(1 for p in cls.W2_PATTERNS if re.search(p, text, re.IGNORECASE))
        if w2_score >= 3:
            return 'w2', None

        for subtype, patterns in cls.NINE_99_PATTERNS.items():
            score = sum(1 for p in patterns if re.search(p, text, re.IGNORECASE))
            if score >= 1:
                return '1099', subtype if subtype != 'generic' else None

        receipt_score = sum(1 for p in cls.RECEIPT_PATTERNS if re.search(p, text, re.IGNORECASE))
        if receipt_score >= 2:
            return 'receipt', None

        return 'unknown', None


# ─── Field Extractors ───────────────────────────────────────────────────────

class W2Extractor:
    """Extract structured data from W-2 forms."""

    BOX_MAPPING = {
        '1': ('wages_tips_compensation', 'Wages, tips, other compensation'),
        '2': ('federal_income_tax_withheld', 'Federal income tax withheld'),
        '3': ('social_security_wages', 'Social security wages'),
        '4': ('social_security_tax_withheld', 'Social security tax withheld'),
        '5': ('medicare_wages_tips', 'Medicare wages and tips'),
        '6': ('medicare_tax_withheld', 'Medicare tax withheld'),
        '7': ('social_security_tips', 'Social security tips'),
        '8': ('allocated_tips', 'Allocated tips'),
        '10': ('dependent_care_benefits', 'Dependent care benefits'),
        '11': ('nonqualified_plans', 'Nonqualified plans'),
        '12a': ('code_12a', 'Box 12 code a'),
        '12b': ('code_12b', 'Box 12 code b'),
        '13': ('statutory_employee', 'Statutory employee'),
        '14': ('other', 'Other'),
        '16': ('state_wages_tips', 'State wages, tips'),
        '17': ('state_income_tax', 'State income tax'),
        '18': ('local_wages_tips', 'Local wages, tips'),
        '19': ('local_income_tax', 'Local income tax'),
    }

    @classmethod
    def extract(cls, text: str) -> List[ExtractedField]:
            """Extract structured fields from W-2 text."""
            fields = []
            lines = text.split("\n")

            # Employer info
            for line in lines:
                m = re.search(r'Employer.*?(?:name|information|ID\s*number|EIN)[:\s]*([\d-]+)', line, re.IGNORECASE)
                if m:
                    val = m.group(1).strip()
                    if re.match(r'^\d{2}-?\d{7}$', val) or re.match(r'^\d{9}$', val.replace('-', '')):
                        fields.append(ExtractedField(name='employer_ein', value=val, confidence=0.85, source='pattern'))
                    break

            # Box values - match each box number on individual lines  
            for box_num, (field_name, label) in cls.BOX_MAPPING.items():
                for line in lines:
                    line_s = line.strip()

                    # Pattern 1: "Box N: $value"  
                    m = re.search(r'Box\s*' + box_num + r'[:\.]\s*\$?\s*([\d,]+\.?\d*)', line_s, re.IGNORECASE)
                    if m:
                        try:
                            val = float(m.group(1).replace(',', ''))
                            if 0 <= val < 9999999:
                                fields.append(ExtractedField(name=field_name, value=val, confidence=0.75, source='pattern'))
                        except ValueError:
                            pass
                        break

                    # Pattern 2: "N label: $value" (line starts with number)
                    label_escaped = re.escape(label)
                    m2 = re.match(r'^' + box_num + r'\s+' + label_escaped + r'[:\.]\s*\$?\s*([\d,]+\.?\d*)', line_s, re.IGNORECASE)
                    if m2:
                        try:
                            val = float(m2.group(1).replace(',', ''))
                            if 0 <= val < 9999999:
                                fields.append(ExtractedField(name=field_name, value=val, confidence=0.75, source='pattern'))
                        except ValueError:
                            pass
                        break

                    # Pattern 3: "N: $value" at line start
                    m3 = re.match(r'^' + box_num + r'[:\.]\s*\$?\s*([\d,]+\.?\d*)', line_s)
                    if m3:
                        try:
                            val = float(m3.group(1).replace(',', ''))
                            if 0 <= val < 9999999:
                                fields.append(ExtractedField(name=field_name, value=val, confidence=0.75, source='pattern'))
                        except ValueError:
                            pass
                        break

            # pdfplumber table extraction
            cls._extract_from_tables(text, fields)

            return fields


    @classmethod
    def _extract_from_tables(cls, text: str, fields: List[ExtractedField]):
        """Parse structured table output from pdfplumber."""
        table_section = ""
        if "=== TABLES ===" in text:
            table_section = text.split("=== TABLES ===")[1].split("===")[0]

        if not table_section:
            return

        # Look for number pairs that look like W-2 box values
        lines = table_section.strip().split('\n')
        for line in lines:
            numbers = re.findall(r'[\d,]+\.\d{2}', line)
            if len(numbers) >= 2:
                # Could be a box row with label + value
                try:
                    vals = [float(n.replace(',', '')) for n in numbers]
                    for v in vals:
                        if 100 < v < 500000:  # Reasonable W-2 range
                            if not any(f.value == v for f in fields):
                                fields.append(ExtractedField(
                                    name=f'table_value_{len(fields)}',
                                    value=v, confidence=0.6, source='table'
                                ))
                except ValueError:
                    pass


class Nine99Extractor:
    """Extract data from 1099 forms."""

    @classmethod
    def extract(cls, text: str, subtype: Optional[str]) -> List[ExtractedField]:
        fields = []

        # Payer info
        payer = re.search(r'Payer\s*(?:name|information|ID)[:\s]*([^\n]+)', text, re.IGNORECASE)
        if payer:
            fields.append(ExtractedField(
                name='payer_name', value=payer.group(1).strip(),
                confidence=0.7, source='pattern'
            ))

        # Box amounts
        for box in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']:
            patterns = [
                rf'(?:Box\s*)?{re.escape(box)}[:\s]*[$]?\s*([\d,]+\.?\d*)',
                rf'^\s*{re.escape(box)}\s+([\d,]+\.?\d*)',
            ]
            for p in patterns:
                m = re.search(p, text, re.MULTILINE)
                if m:
                    try:
                        val = float(m.group(1).replace(',', ''))
                        fields.append(ExtractedField(
                            name=f'box_{box}', value=val,
                            confidence=0.7, source='pattern'
                        ))
                        break
                    except ValueError:
                        continue

        return fields


class ReceiptExtractor:
    """Extract data from receipts/invoices."""

    @classmethod
    def extract(cls, text: str) -> List[ExtractedField]:
        fields = []

        # Total amount
        total = re.search(r'(?:Total|Amount|Balance)\s*(?:Due)?[:\s]*[$]?\s*([\d,]+\.?\d*)', text, re.IGNORECASE)
        if total:
            try:
                val = float(total.group(1).replace(',', ''))
                fields.append(ExtractedField(
                    name='total_amount', value=val,
                    confidence=0.7, source='pattern'
                ))
            except ValueError:
                pass

        # Date
        date = re.search(r'(?:Date|Purchased|Transaction)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})', text, re.IGNORECASE)
        if date:
            fields.append(ExtractedField(
                name='transaction_date', value=date.group(1),
                confidence=0.65, source='pattern'
            ))

        # Merchant name (first line often contains it)
        lines = [l.strip() for l in text.strip().split('\n') if l.strip()]
        if lines:
            fields.append(ExtractedField(
                name='merchant', value=lines[0][:100],
                confidence=0.4, source='pattern'
            ))

        return fields


# ─── Deduction Engine ───────────────────────────────────────────────────────

class DeductionEngine:
    """Analyze extracted fields + income to find potential deductions."""

    # 2025/2026 standard deduction and thresholds
    STANDARD_DEDUCTION_SINGLE = 15000  # 2026 approximate
    STANDARD_DEDUCTION_MARRIED = 30000
    STANDARD_DEDUCTION_HOH = 22500

    # Mileage rates (2025/2026 approximate)
    MILEAGE_RATE_BUSINESS = 0.70
    MILEAGE_RATE_MEDICAL = 0.24
    MILEAGE_RATE_CHARITY = 0.14

    @classmethod
    def analyze(
        cls,
        doc_result: DocumentResult,
        gross_income: Optional[float] = None,
        filing_status: str = 'single'
    ) -> List[DeductionFinding]:
        deductions = []

        # ── W-2 based ──
        if doc_result.document_type == 'w2':
            # Get wages
            wages = None
            for f in doc_result.fields:
                if f.name == 'wages_tips_compensation':
                    wages = f.value
                    break

            if wages and wages > 0:
                # Standard deduction always applies
                std_ded = cls._get_standard_deduction(filing_status)
                deductions.append(DeductionFinding(
                    category='standard_deduction',
                    description=f'Standard deduction ({filing_status})',
                    estimated_amount=std_ded,
                    confidence=0.95,
                ))

                # If social security wages exist, medicare deduction
                for f in doc_result.fields:
                    if f.name == 'medicare_wages_tips' and f.value > 0:
                        deductions.append(DeductionFinding(
                            category='payroll_tax',
                            description='Medicare wages (employer contribution portion)',
                            estimated_amount=f.value * 0.0145,
                            confidence=0.5,
                            source_field=f.name,
                        ))

        # ── 1099 based ──
        if doc_result.document_type == '1099':
            # Self-employment income — can deduct half of SE tax
            total_payments = None
            for f in doc_result.fields:
                if f.name == 'box_1' or f.name == 'box_7':
                    total_payments = f.value
                    break

            if total_payments and total_payments > 0:
                # Self-employment tax deduction
                se_tax = total_payments * 0.153 * 0.5  # ~7.65% of income
                deductions.append(DeductionFinding(
                    category='self_employment_tax',
                    description='Deductible half of self-employment tax',
                    estimated_amount=round(se_tax, 2),
                    confidence=0.8,
                ))

                # QBI deduction (qualified business income)
                qbi = total_payments * 0.20
                deductions.append(DeductionFinding(
                    category='qbi_deduction',
                    description='Qualified Business Income deduction (20%)',
                    estimated_amount=round(qbi, 2),
                    confidence=0.6,
                ))

                # Retirement contribution suggestion
                retirement = min(total_payments * 0.25, 69000)  # Solo 401k max
                deductions.append(DeductionFinding(
                    category='retirement_potential',
                    description='Potential Solo 401(k) contribution',
                    estimated_amount=round(retirement, 2),
                    confidence=0.3,  # Low confidence — user must actually contribute
                ))

        # ── Receipt based ──
        if doc_result.document_type == 'receipt':
            total = None
            for f in doc_result.fields:
                if f.name == 'total_amount':
                    total = f.value
                    break
            if total and total > 0:
                deductions.append(DeductionFinding(
                    category='business_expense',
                    description='Business expense (from receipt)',
                    estimated_amount=total,
                    confidence=0.5,  # Needs user validation
                ))

        return deductions

    @classmethod
    def _get_standard_deduction(cls, status: str) -> float:
        mapping = {
            'single': cls.STANDARD_DEDUCTION_SINGLE,
            'married': cls.STANDARD_DEDUCTION_MARRIED,
            'married_joint': cls.STANDARD_DEDUCTION_MARRIED,
            'married_filing_separately': cls.STANDARD_DEDUCTION_SINGLE,
            'head_of_household': cls.STANDARD_DEDUCTION_HOH,
        }
        return mapping.get(status.lower().strip(), cls.STANDARD_DEDUCTION_SINGLE)


# ─── Main Pipeline ──────────────────────────────────────────────────────────

class DocumentProcessor:
    """End-to-end document processing pipeline."""

    @staticmethod
    def process(
        file_path: str,
        filename: str,
        gross_income: Optional[float] = None,
        filing_status: str = 'single'
    ) -> ProcessingResult:
        """Process a single document end-to-end."""
        try:
            # Step 1: OCR
            text, method = OCREngine.extract_text(file_path)

            if not text.strip():
                return ProcessingResult(
                    document=DocumentResult(
                        filename=filename,
                        document_type='unknown',
                        document_subtype=None,
                        tax_year=None,
                        raw_text='',
                        error='No text could be extracted from this document'
                    )
                )

            # Step 2: Classify
            doc_type, sub_type = DocumentClassifier.classify(text, filename)

            # Step 3: Extract
            extractors = {
                'w2': W2Extractor,
                '1099': Nine99Extractor,
                'receipt': ReceiptExtractor,
            }
            extractor = extractors.get(doc_type)
            fields = extractor.extract(text) if extractor else []
            if not fields:
                fields = []

            # Extract tax year from filename or content
            tax_year = None
            year_match = re.search(r'(20\d{2})', filename)
            if year_match:
                tax_year = int(year_match.group(1))
            else:
                year_match = re.search(r'(20\d{2})', text)
                if year_match:
                    tax_year = int(year_match.group(1))

            doc_result = DocumentResult(
                filename=filename,
                document_type=doc_type,
                document_subtype=sub_type,
                tax_year=tax_year,
                fields=fields,
                raw_text=text[:5000],  # Store first 5k chars
                extraction_method=method,
            )

            # Step 4: Deduction analysis
            deductions = DeductionEngine.analyze(doc_result, gross_income, filing_status)

            return ProcessingResult(
                document=doc_result,
                deductions=deductions,
            )

        except Exception as e:
            logger.exception(f"Document processing failed for {filename}")
            return ProcessingResult(
                document=DocumentResult(
                    filename=filename,
                    document_type='unknown',
                    document_subtype=None,
                    tax_year=None,
                    raw_text='',
                    error=str(e)
                )
            )

    @staticmethod
    def batch_process(
        file_paths: List[Tuple[str, str]],
        gross_income: Optional[float] = None,
        filing_status: str = 'single'
    ) -> List[ProcessingResult]:
        """Process multiple documents."""
        results = []
        for file_path, filename in file_paths:
            result = DocumentProcessor.process(file_path, filename, gross_income, filing_status)
            results.append(result)
        return results
