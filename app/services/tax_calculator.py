"""Tax calculation service with dynamic yearly bracket loading."""
import json
import os

from app.schemas.calculation import CalculationResponse

FALLBACK_BRACKETS = {
    "single": [
        (11925, 0.10),
        (48475, 0.12),
        (103350, 0.22),
        (197300, 0.24),
        (250525, 0.32),
        (626350, 0.35),
        (float("inf"), 0.37),
    ],
    "married_joint": [
        (23850, 0.10),
        (96950, 0.12),
        (206700, 0.22),
        (394600, 0.24),
        (501050, 0.32),
        (751600, 0.35),
        (float("inf"), 0.37),
    ],
}

FALLBACK_STANDARD_DEDUCTION = {
    "single": 15000.0,
    "married_joint": 30000.0,
}

_BRACKETS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "tax_brackets.json")


def _compute_tax(taxable_income: float, brackets: list[tuple[float, float]]) -> float:
    tax = 0.0
    previous_limit = 0.0
    for limit, rate in brackets:
        if taxable_income > previous_limit:
            taxed_amount = min(taxable_income, limit) - previous_limit
            tax += taxed_amount * rate
            previous_limit = limit
        else:
            break
    return round(tax, 2)


class TaxCalculator:
    @staticmethod
    def _load_brackets(tax_year: int) -> dict:
        try:
            with open(_BRACKETS_FILE, "r") as f:
                all_brackets = json.load(f)
            available_years = TaxCalculator._get_available_years()
            year_key = str(tax_year)
            if year_key not in all_brackets:
                year_key = str(available_years[-1])
            data = all_brackets[year_key]
            return {
                "single": [tuple(b) for b in data["single"]],
                "married_joint": [tuple(b) for b in data["married_joint"]],
                "standard_deduction": data["standard_deduction"],
            }
        except (FileNotFoundError, json.JSONDecodeError, KeyError):
            return {
                "single": FALLBACK_BRACKETS["single"],
                "married_joint": FALLBACK_BRACKETS["married_joint"],
                "standard_deduction": FALLBACK_STANDARD_DEDUCTION,
            }

    @staticmethod
    def _get_available_years() -> list[int]:
        try:
            with open(_BRACKETS_FILE, "r") as f:
                all_brackets = json.load(f)
            return sorted(int(y) for y in all_brackets.keys())
        except (FileNotFoundError, json.JSONDecodeError):
            return [2025]

    @staticmethod
    def filing_statuses() -> list[str]:
        return ["single", "married_joint"]

    @staticmethod
    def calculate(
        gross_income: float,
        total_deductions: float,
        filing_status: str = "single",
        tax_year: int = 2025,
    ) -> CalculationResponse:
        bracket_data = TaxCalculator._load_brackets(tax_year)
        standard_deduction = bracket_data["standard_deduction"].get(
            filing_status, bracket_data["standard_deduction"]["single"]
        )
        taxable_income = max(0.0, gross_income - total_deductions - standard_deduction)

        brackets = (
            bracket_data["single"]
            if filing_status == "single"
            else bracket_data["married_joint"]
        )
        estimated_tax = _compute_tax(taxable_income, brackets)

        estimated_refund = max(0.0, (gross_income * 0.10) - estimated_tax)

        effective_tax_rate = (
            round(estimated_tax / gross_income * 100, 2) if gross_income > 0 else 0.0
        )

        return CalculationResponse(
            gross_income=gross_income,
            total_deductions=total_deductions,
            taxable_income=round(taxable_income, 2),
            estimated_tax=estimated_tax,
            estimated_refund=round(estimated_refund, 2),
            effective_tax_rate=effective_tax_rate,
            status="calculated",
        )
