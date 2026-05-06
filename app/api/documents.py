"""Document upload and management API routes."""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a tax document (W-2, 1099, receipt, etc.)."""
    # TODO: Implement document upload with OCR pipeline
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "status": "uploaded",
        "message": "Document received. Processing will begin shortly."
    }


@router.get("/{document_id}")
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get document status and metadata."""
    # TODO: Fetch from DB
    return {"document_id": document_id, "status": "pending"}


@router.get("/{document_id}/data")
async def get_document_data(document_id: int, db: Session = Depends(get_db)):
    """Get extracted data from a processed document."""
    return {"document_id": document_id, "extracted_fields": []}
