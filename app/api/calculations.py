"""Tax calculation API routes — Supabase backend."""
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_supabase
from app.core.security import get_current_user
from app.schemas.calculation import (
    CalculationRequest,
    SummaryListResponse,
    SummaryResponse,
)
from app.services.tax_calculator import TaxCalculator

router = APIRouter()


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

    supabase = get_supabase()
    summary_data = {
        "user_id": current_user.id,
        "tax_year": data.tax_year,
        "gross_income": result.gross_income,
        "total_deductions": result.total_deductions,
        "estimated_tax": result.estimated_tax,
        "estimated_refund": result.estimated_refund,
        "status": result.status,
    }

    summary_result = supabase.table("tax_summaries").insert(summary_data).execute()
    return SummaryResponse.model_validate(summary_result.data[0])


@router.get("/list", response_model=SummaryListResponse)
async def list_calculations(current_user=Depends(get_current_user)):
    supabase = get_supabase()
    result = (
        supabase.table("tax_summaries")
        .select("*")
        .eq("user_id", current_user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return SummaryListResponse(summaries=result.data, total=len(result.data))


@router.get("/{summary_id}", response_model=SummaryResponse)
async def get_calculation(summary_id: int, current_user=Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("tax_summaries").select("*").eq("id", summary_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Calculation not found")
    if result.data[0]["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Calculation not found")

    return SummaryResponse.model_validate(result.data[0])


@router.delete("/{summary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_calculation(summary_id: int, current_user=Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("tax_summaries").select("*").eq("id", summary_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Calculation not found")
    if result.data[0]["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Calculation not found")

    supabase.table("tax_summaries").delete().eq("id", summary_id).execute()
    return None
