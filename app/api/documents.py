"""Document upload and management API routes — Supabase backend."""
import os
import uuid

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

from app.core.config import settings
from app.core.database import get_supabase
from app.core.security import get_current_user
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
    current_user=Depends(get_current_user),
):
    content = _validate_and_read(file)
    supabase = get_supabase()

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

    doc_data = {
        "user_id": current_user.id,
        "filename": file.filename or unique_name,
        "file_path": file_path,
        "file_type": file.content_type,
        "status": "extracted" if extracted_text else "processing",
    }

    doc_result = supabase.table("documents").insert(doc_data).execute()
    doc = doc_result.data[0]

    if extracted_text:
        supabase.table("extracted_data").insert({
            "document_id": doc["id"],
            "field_name": "raw_text",
            "field_value": extracted_text,
            "confidence": 1.0,
        }).execute()

    return DocumentUploadResponse(
        document_id=doc["id"],
        filename=doc["filename"],
        extracted_text=extracted_text,
        status=doc["status"],
    )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int):
    supabase = get_supabase()
    doc_result = supabase.table("documents").select("*").eq("id", document_id).execute()

    if not doc_result.data:
        raise HTTPException(status_code=404, detail="Document not found")

    doc = doc_result.data[0]

    extracted_result = supabase.table("extracted_data").select("*").eq("document_id", document_id).execute()
    extracted_fields = [
        ExtractedFieldResponse(
            field_name=e["field_name"],
            field_value=e["field_value"],
            confidence=e["confidence"],
        )
        for e in extracted_result.data
    ]

    return DocumentResponse(
        id=doc["id"],
        user_id=doc["user_id"],
        filename=doc["filename"],
        file_path=doc["file_path"],
        file_type=doc["file_type"],
        status=doc["status"],
        created_at=doc.get("created_at"),
        updated_at=doc.get("updated_at"),
        extracted_fields=extracted_fields,
    )


@router.get("/{document_id}/data", response_model=DocumentDataResponse)
async def get_document_data(document_id: int):
    supabase = get_supabase()
    doc_result = supabase.table("documents").select("*").eq("id", document_id).execute()

    if not doc_result.data:
        raise HTTPException(status_code=404, detail="Document not found")

    extracted_result = supabase.table("extracted_data").select("*").eq("document_id", document_id).execute()
    extracted_fields = [
        ExtractedFieldResponse(
            field_name=e["field_name"],
            field_value=e["field_value"],
            confidence=e["confidence"],
        )
        for e in extracted_result.data
    ]

    return DocumentDataResponse(
        document_id=doc_result.data[0]["id"],
        status=doc_result.data[0]["status"],
        extracted_fields=extracted_fields,
    )
