"""OCR service for extracting text from documents using pytesseract."""
import pytesseract
from PIL import Image
from pypdf import PdfReader


class OCRService:
    ALLOWED_IMAGE_TYPES = frozenset({"image/png", "image/jpeg", "image/jpg"})
    ALLOWED_PDF_TYPE = "application/pdf"

    @classmethod
    def extract_text(cls, file_path: str, content_type: str) -> str:
        if content_type in cls.ALLOWED_IMAGE_TYPES:
            return cls._extract_from_image(file_path)
        if content_type == cls.ALLOWED_PDF_TYPE:
            return cls._extract_from_pdf(file_path)
        raise ValueError(f"Unsupported content type for OCR: {content_type}")

    @classmethod
    def _extract_from_image(cls, file_path: str) -> str:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text.strip()

    @classmethod
    def _extract_from_pdf(cls, file_path: str) -> str:
        reader = PdfReader(file_path)
        texts: list[str] = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                texts.append(page_text)
        return "\n".join(texts).strip()
