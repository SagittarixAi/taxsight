from app.services.tax_calculator import TaxCalculator


def test_create_calculation_success(client, auth_headers):
    response = client.post("/api/calculations/", json={
        "tax_year": 2024,
        "gross_income": 100000,
        "total_deductions": 5000,
        "filing_status": "single",
    }, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tax_year"] == 2024
    assert data["gross_income"] == 100000.0
    assert data["total_deductions"] == 5000.0
    assert "estimated_tax" in data
    assert "estimated_refund" in data
    assert data["status"] == "calculated"


def test_create_calculation_no_auth(client):
    response = client.post("/api/calculations/", json={
        "tax_year": 2024,
        "gross_income": 100000,
        "total_deductions": 5000,
    })
    assert response.status_code == 401


def test_list_calculations(client, auth_headers):
    client.post("/api/calculations/", json={
        "tax_year": 2024,
        "gross_income": 100000,
        "total_deductions": 5000,
    }, headers=auth_headers)

    response = client.get("/api/calculations/list", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert len(data["summaries"]) >= 1


def test_calculation_taxable_income():
    result = TaxCalculator.calculate(
        gross_income=100000,
        total_deductions=5000,
        filing_status="single",
        tax_year=2024,
    )
    assert result.taxable_income == 80400.0


def test_different_years_different_tax():
    result_2024 = TaxCalculator.calculate(100000, 5000, "single", 2024)
    result_2025 = TaxCalculator.calculate(100000, 5000, "single", 2025)
    assert result_2024.estimated_tax != result_2025.estimated_tax
