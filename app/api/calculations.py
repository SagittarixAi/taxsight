"""Tax calculation API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.tax_summary import TaxSummary
from app.models.user import User
from app.schemas.calculation import (
    CalculationRequest,
    CalculationResponse,
    SummaryCreate,
    SummaryListResponse,
    SummaryResponse,
)
from app.services.tax_calculator import TaxCalculator

router = APIRouter()


@router.post("/", response_model=SummaryResponse)
async def create_calculation(
    data: CalculationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = TaxCalculator.calculate(
        gross_income=data.gross_income,
        total_deductions=data.total_deductions,
        filing_status=data.filing_status,
        tax_year=data.tax_year,
    )

    summary = TaxSummary(
        user_id=current_user.id,
        tax_year=data.tax_year,
        gross_income=result.gross_income,
        total_deductions=result.total_deductions,
        estimated_tax=result.estimated_tax,
        estimated_refund=result.estimated_refund,
        status=result.status,
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary


@router.get("/list", response_model=SummaryListResponse)
async def list_calculations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    summaries = (
        db.query(TaxSummary)
        .filter(TaxSummary.user_id == current_user.id)
        .order_by(TaxSummary.created_at.desc())
        .all()
    )
    return SummaryListResponse(summaries=summaries, total=len(summaries))


@router.get("/{summary_id}", response_model=SummaryResponse)
async def get_calculation(
    summary_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    summary = db.query(TaxSummary).filter(TaxSummary.id == summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Calculation not found")
    if summary.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Calculation not found")
    return summary


@router.delete("/{summary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_calculation(
    summary_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    summary = db.query(TaxSummary).filter(TaxSummary.id == summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Calculation not found")
    if summary.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Calculation not found")
    db.delete(summary)
    db.commit()
    return None
