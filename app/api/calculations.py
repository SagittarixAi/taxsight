"""Tax calculation API routes — Supabase REST backend."""
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import rest_get, rest_insert, rest_delete
from app.core.security import get_current_user
from app.schemas.calculation import (
    CalculationRequest,
    SummaryListResponse,
    SummaryResponse,
)
from app.services.tax_calculator import TaxCalculator

router = APIRouter()


def _get_summary_or_404(summary_id: int, user_id) -> dict:
    rows = rest_get("tax_summaries", {
        "id": f"eq.{summary_id}",
        "select": "*",
    })
    if not rows:
        raise HTTPException(status_code=404, detail="Summary not found")
    if rows[0]["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Summary not found")
    return rows[0]


@router.post("/", response_model=SummaryResponse)
async def create_calculation(
    data: CalculationRequest,
    current_user=Depends(get_current_user),
):
    result = TaxCalculator.calculate(
        gross_income=data.gross_income,
        total_deductions=data.total_deductions,
        filing_status=data.filing_status,
        tax_year=data.tax_year,
    )

    rows = rest_insert("tax_summaries", {
        "user_id": current_user["id"],
        "tax_year": data.tax_year,
        "gross_income": result.gross_income,
        "total_deductions": result.total_deductions,
        "estimated_tax": result.estimated_tax,
        "estimated_refund": result.estimated_refund,
        "status": result.status,
    })
    return SummaryResponse.model_validate(rows[0])


@router.get("/list", response_model=SummaryListResponse)
async def list_calculations(current_user=Depends(get_current_user)):
    rows = rest_get("tax_summaries", {
        "user_id": f"eq.{current_user["id"]}",
        "order": "created_at.desc",
        "select": "*",
    })
    return SummaryListResponse(summaries=rows, total=len(rows))


@router.get("/{summary_id}", response_model=SummaryResponse)
async def get_calculation(summary_id: int, current_user=Depends(get_current_user)):
    s = _get_summary_or_404(summary_id, current_user["id"])
    return SummaryResponse.model_validate(s)


@router.delete("/{summary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_calculation(summary_id: int, current_user=Depends(get_current_user)):
    _get_summary_or_404(summary_id, current_user["id"])
    rest_delete("tax_summaries", "id", summary_id)
    return None
