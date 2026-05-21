"""Document upload and management API routes — Supabase REST backend."""
import os
import uuid
from typing import List

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status

from app.core.config import settings
from app.core.database import rest_get, rest_insert
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

    rows = rest_insert("documents", {
        "user_id": current_user["id"],
        "filename": file.filename or unique_name,
        "file_path": file_path,
        "file_type": file.content_type,
        "status": "extracted" if extracted_text else "processing",
    })
    doc = rows[0] if rows else {}

    if extracted_text and doc.get("id"):
        rest_insert("extracted_data", {
            "document_id": doc["id"],
            "field_name": "raw_text",
            "field_value": extracted_text,
            "confidence": 1.0,
        })

    return DocumentUploadResponse(
        document_id=doc.get("id"),
        filename=doc.get("filename", file.filename),
        extracted_text=extracted_text,
        status=doc.get("status", "processing"),
    )


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(current_user=Depends(get_current_user)):
    """List all documents for the authenticated user."""
    rows = rest_get("documents", {"user_id": f"eq.{current_user['id']}", "select": "*", "order": "created_at.desc"})
    if not rows:
        return []

    results = []
    for doc in rows:
        extracted_rows = rest_get("extracted_data", {
            "document_id": f"eq.{doc['id']}",
            "select": "field_name,field_value,confidence",
        })
        extracted_fields = [
            ExtractedFieldResponse(
                field_name=e["field_name"],
                field_value=e["field_value"],
                confidence=e["confidence"],
            )
            for e in extracted_rows
        ]
        results.append(DocumentResponse(
            id=doc["id"],
            user_id=doc["user_id"],
            filename=doc["filename"],
            file_path=doc["file_path"],
            file_type=doc["file_type"],
            status=doc["status"],
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
            extracted_fields=extracted_fields,
        ))
    return results


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: int, current_user=Depends(get_current_user)):
    """Delete a document by ID (scoped to current user)."""
    rows = rest_get("documents", {"id": f"eq.{document_id}", "select": "id,user_id,file_path"})
    if not rows:
        raise HTTPException(status_code=404, detail="Document not found")

    doc = rows[0]
    if doc["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")

    # Delete file from disk
    file_path = doc.get("file_path")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)

    from app.core.database import rest_delete
    rest_delete("extracted_data", {"document_id": f"eq.{document_id}"})
    rest_delete("documents", {"id": f"eq.{document_id}"})


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int):
    rows = rest_get("documents", {"id": f"eq.{document_id}", "select": "*"})
    if not rows:
        raise HTTPException(status_code=404, detail="Document not found")

    doc = rows[0]
    extracted_rows = rest_get("extracted_data", {
        "document_id": f"eq.{document_id}",
        "select": "field_name,field_value,confidence",
    })

    extracted_fields = [
        ExtractedFieldResponse(
            field_name=e["field_name"],
            field_value=e["field_value"],
            confidence=e["confidence"],
        )
        for e in extracted_rows
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
    rows = rest_get("documents", {"id": f"eq.{document_id}", "select": "id,status"})
    if not rows:
        raise HTTPException(status_code=404, detail="Document not found")

    extracted_rows = rest_get("extracted_data", {
        "document_id": f"eq.{document_id}",
        "select": "field_name,field_value,confidence",
    })

    extracted_fields = [
        ExtractedFieldResponse(
            field_name=e["field_name"],
            field_value=e["field_value"],
            confidence=e["confidence"],
        )
        for e in extracted_rows
    ]

    return DocumentDataResponse(
        document_id=rows[0]["id"],
        status=rows[0]["status"],
        extracted_fields=extracted_fields,
    )
