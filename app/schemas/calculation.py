"""Pydantic schemas for tax calculations and summaries."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CalculationRequest(BaseModel):
    tax_year: int
    gross_income: float
    total_deductions: float
    filing_status: str = "single"


class CalculationResponse(BaseModel):
    gross_income: float
    total_deductions: float
    taxable_income: float
    estimated_tax: float
    estimated_refund: float
    effective_tax_rate: float
    status: str = "calculated"


class SummaryCreate(BaseModel):
    tax_year: int
    gross_income: float
    total_deductions: float
    estimated_tax: float
    estimated_refund: float
    status: str = "draft"


class SummaryResponse(BaseModel):
    id: int
    user_id: int
    tax_year: int
    gross_income: float
    total_deductions: float
    estimated_tax: float
    estimated_refund: float
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SummaryListResponse(BaseModel):
    summaries: list[SummaryResponse]
    total: int
