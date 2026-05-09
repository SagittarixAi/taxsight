"""Enhanced document endpoints with AI processing pipeline."""

import os
import json
import logging
import tempfile
from pathlib import Path
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models import Document, User
from app.services.document_processor import DocumentProcessor

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["documents-enhanced"])

UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "/tmp/taxsight-uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload-with-ai")
async def upload_with_ai(
    file: UploadFile = File(...),
    filing_status: str = Form("single"),
    gross_income: float = Form(0.0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a document, run AI extraction, and return analysis results."""
    # Validate file type
    allowed_types = {".pdf", ".png", ".jpg", ".jpeg", ".tiff"}
    ext = Path(file.filename).suffix.lower()
    if ext not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Supported: {', '.join(allowed_types)}"
        )

    # Save file temporarily
    safe_name = f"{datetime.utcnow().timestamp()}_{current_user.id}_{file.filename}"
    file_path = UPLOAD_DIR / safe_name

    try:
        content = await file.read()
        file_path.write_bytes(content)
        logger.info(f"Saved upload: {file_path} ({len(content)} bytes)")

        # Run AI processing pipeline
        result = DocumentProcessor.process(
            file_path=str(file_path),
            filename=file.filename,
            gross_income=gross_income if gross_income > 0 else None,
            filing_status=filing_status,
        )

        # Save document metadata to database
        db_document = Document(
            user_id=current_user.id,
            filename=file.filename,
            storage_path=str(file_path),
            document_type=result.document.document_type,
            document_subtype=result.document.document_subtype,
            file_size=len(content),
            status="complete" if not result.document.error else "error",
            extracted_data=json.dumps({
                "fields": [
                    {"name": f.name, "value": f.value, "confidence": f.confidence}
                    for f in result.document.fields
                ],
                "deductions": [
                    {
                        "category": d.category,
                        "description": d.description,
                        "estimated_amount": d.estimated_amount,
                        "confidence": d.confidence,
                    }
                    for d in result.deductions
                ],
                "extraction_method": result.document.extraction_method,
                "tax_year": result.document.tax_year,
            }),
            processing_error=result.document.error,
            created_at=datetime.utcnow(),
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)

        return {
            "id": db_document.id,
            "filename": file.filename,
            "document_type": result.document.document_type,
            "document_subtype": result.document.document_subtype,
            "tax_year": result.document.tax_year,
            "status": "complete" if not result.document.error else "error",
            "fields_count": len(result.document.fields),
            "deductions_found": len(result.deductions),
            "total_deductions_estimate": round(sum(
                d.estimated_amount for d in result.deductions
            ), 2),
            "error": result.document.error,
            "fields": [
                {"name": f.name, "value": f.value, "confidence": f.confidence}
                for f in result.document.fields
            ],
            "deductions": [
                {
                    "category": d.category,
                    "description": d.description,
                    "estimated_amount": d.estimated_amount,
                    "confidence": d.confidence,
                }
                for d in result.deductions
            ],
        }

    except Exception as e:
        logger.exception(f"Upload processing failed for {file.filename}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    finally:
        # Clean up temp file after processing
        if file_path.exists():
            file_path.unlink()


@router.post("/batch-upload-with-ai")
async def batch_upload_with_ai(
    files: List[UploadFile] = File(...),
    filing_status: str = Form("single"),
    gross_income: float = Form(0.0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload multiple documents and process with AI pipeline."""
    results = []
    for file in files:
        # Reuse the single upload logic
        ext = Path(file.filename).suffix.lower()
        safe_name = f"{datetime.utcnow().timestamp()}_{current_user.id}_{file.filename}"
        file_path = UPLOAD_DIR / safe_name

        try:
            content = await file.read()
            file_path.write_bytes(content)

            result = DocumentProcessor.process(
                file_path=str(file_path),
                filename=file.filename,
                gross_income=gross_income if gross_income > 0 else None,
                filing_status=filing_status,
            )

            db_document = Document(
                user_id=current_user.id,
                filename=file.filename,
                storage_path=str(file_path),
                document_type=result.document.document_type,
                document_subtype=result.document.document_subtype,
                file_size=len(content),
                status="complete" if not result.document.error else "error",
                extracted_data=json.dumps({
                    "fields": [
                        {"name": f.name, "value": f.value, "confidence": f.confidence}
                        for f in result.document.fields
                    ],
                    "deductions": [
                        {
                            "category": d.category,
                            "description": d.description,
                            "estimated_amount": d.estimated_amount,
                            "confidence": d.confidence,
                        }
                        for d in result.deductions
                    ],
                }),
                processing_error=result.document.error,
                created_at=datetime.utcnow(),
            )
            db.add(db_document)
            db.commit()

            results.append({
                "id": db_document.id,
                "filename": file.filename,
                "document_type": result.document.document_type,
                "status": "complete" if not result.document.error else "error",
                "deductions_found": len(result.deductions),
                "error": result.document.error,
            })

        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e),
            })
        finally:
            if file_path.exists():
                file_path.unlink()

    return {
        "processed": len(results),
        "results": results,
    }


@router.get("/extraction/{document_id}")
async def get_extraction(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get AI extraction results for a processed document."""
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id,
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id,
        "filename": doc.filename,
        "document_type": doc.document_type,
        "extracted_data": json.loads(doc.extracted_data or "{}"),
        "status": doc.status,
    }


@router.get("/deductions/summary")
async def get_deductions_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Aggregate all deductions found across user's documents."""
    docs = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.status == "complete",
        Document.document_type != "unknown",
    ).all()

    all_deductions = []
    total_estimate = 0.0
    by_category = {}

    for doc in docs:
        if not doc.extracted_data:
            continue
        try:
            data = json.loads(doc.extracted_data)
            for d in data.get("deductions", []):
                all_deductions.append({
                    **d,
                    "document_id": doc.id,
                    "filename": doc.filename,
                })
                total_estimate += d["estimated_amount"]
                cat = d["category"]
                by_category[cat] = by_category.get(cat, 0) + d["estimated_amount"]
            data.get("total_deductions")
        except (json.JSONDecodeError, KeyError):
            continue

    return {
        "total_deductions_estimate": round(total_estimate, 2),
        "total_documents_scanned": len(docs),
        "by_category": {k: round(v, 2) for k, v in sorted(by_category.items(), key=lambda x: -x[1])},
        "deductions": all_deductions,
    }
