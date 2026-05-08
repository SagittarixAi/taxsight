"""Document upload and management API routes."""
import os
import uuid

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.document import Document, DocumentStatus
from app.models.extracted_data import ExtractedData
from app.schemas.document import (
    DocumentDataResponse,
    DocumentResponse,
    DocumentUploadResponse,
    ExtractedFieldResponse,
)
from app.services.ocr import OCRService

router = APIRouter()

ALLOWED_CONTENT_TYPES = frozenset({
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
})

EXTENSION_MAP = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
}


def _validate_and_read(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: PDF, PNG, JPEG",
        )

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    contents = file.file.read()

    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit",
        )

    return contents


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = _validate_and_read(file)

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = EXTENSION_MAP.get(file.content_type, ".bin")
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        extracted_text = OCRService.extract_text(file_path, file.content_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    document = Document(
        user_id=current_user.id,
        filename=file.filename or unique_name,
        file_path=file_path,
        file_type=file.content_type,
        status=DocumentStatus.EXTRACTED if extracted_text else DocumentStatus.PROCESSING,
    )
    db.add(document)
    db.flush()

    if extracted_text:
        extracted = ExtractedData(
            document_id=document.id,
            field_name="raw_text",
            field_value=extracted_text,
            confidence=1.0,
        )
        db.add(extracted)

    db.commit()
    db.refresh(document)

    return DocumentUploadResponse(
        document_id=document.id,
        filename=document.filename,
        extracted_text=extracted_text,
        status=document.status.value,
    )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    extracted_fields = [
        ExtractedFieldResponse(
            field_name=e.field_name,
            field_value=e.field_value,
            confidence=e.confidence,
        )
        for e in document.extracted_data
    ]

    return DocumentResponse(
        id=document.id,
        user_id=document.user_id,
        filename=document.filename,
        file_path=document.file_path,
        file_type=document.file_type,
        status=document.status.value,
        created_at=document.created_at,
        updated_at=document.updated_at,
        extracted_fields=extracted_fields,
    )


@router.get("/{document_id}/data", response_model=DocumentDataResponse)
async def get_document_data(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    extracted_fields = [
        ExtractedFieldResponse(
            field_name=e.field_name,
            field_value=e.field_value,
            confidence=e.confidence,
        )
        for e in document.extracted_data
    ]

    return DocumentDataResponse(
        document_id=document.id,
        status=document.status.value,
        extracted_fields=extracted_fields,
    )
