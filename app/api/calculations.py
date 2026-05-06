"""Tax calculation API routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.post("/")
async def calculate_tax(data: dict, db: Session = Depends(get_db)):
    """Run tax calculation on extracted document data."""
    # TODO: Implement AI-powered tax calculation
    return {
        "gross_income": data.get("gross_income", 0),
        "estimated_tax": 0,
        "estimated_refund": 0,
        "status": "calculated"
    }
