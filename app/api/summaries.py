"""Tax summary API routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.get("/{summary_id}")
async def get_summary(summary_id: int, db: Session = Depends(get_db)):
    """Get a tax summary by ID."""
    return {"summary_id": summary_id, "status": "draft"}


@router.get("/{summary_id}/export")
async def export_summary(summary_id: int, db: Session = Depends(get_db)):
    """Export tax summary as PDF."""
    # TODO: Generate PDF with weasyprint
    return {"summary_id": summary_id, "export_url": None}
