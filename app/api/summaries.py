"""Tax summary API routes — Supabase REST backend."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from weasyprint import HTML

from app.core.database import rest_get
from app.core.security import get_current_user
from app.schemas.calculation import SummaryListResponse, SummaryResponse

router = APIRouter()


@router.get("/", response_model=SummaryListResponse)
async def list_summaries(current_user=Depends(get_current_user)):
    rows = rest_get("tax_summaries", {
        "user_id": f"eq.{current_user.id}",
        "order": "created_at.desc",
        "select": "*",
    })
    return SummaryListResponse(summaries=rows, total=len(rows))


@router.get("/{summary_id}", response_model=SummaryResponse)
async def get_summary(summary_id: int, current_user=Depends(get_current_user)):
    rows = rest_get("tax_summaries", {"id": f"eq.{summary_id}", "select": "*"})
    if not rows:
        raise HTTPException(status_code=404, detail="Summary not found")
    if rows[0]["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Summary not found")
    return SummaryResponse.model_validate(rows[0])


@router.get("/{summary_id}/export")
async def export_summary(summary_id: int, current_user=Depends(get_current_user)):
    rows = rest_get("tax_summaries", {"id": f"eq.{summary_id}", "select": "*"})
    if not rows:
        raise HTTPException(status_code=404, detail="Summary not found")

    s = rows[0]
    if s["user_id"] != current_user.id:
        raise HTTPException(status_code=404, detail="Summary not found")

    effective_tax_rate = (
        round(s["estimated_tax"] / s["gross_income"] * 100, 2)
        if s["gross_income"] > 0
        else 0.0
    )

    generated_date = datetime.now(timezone.utc).strftime("%B %d, %Y")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a2e; }}
  .header {{ border-bottom: 3px solid #16213e; padding-bottom: 16px; margin-bottom: 24px; }}
  .header h1 {{ color: #16213e; margin: 0 0 4px 0; font-size: 26px; }}
  .header p {{ color: #555; margin: 0; font-size: 13px; }}
  .info-grid {{ display: flex; flex-wrap: wrap; gap: 12px 0; margin-bottom: 28px; }}
  .info-item {{ width: 50%; }}
  .info-item label {{ display: block; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 0.5px; }}
  .info-item span {{ font-size: 15px; color: #1a1a2e; }}
  table {{ width: 100%; border-collapse: collapse; margin-bottom: 28px; }}
  th, td {{ padding: 12px 14px; text-align: left; border-bottom: 1px solid #e0e0e0; }}
  th {{ background: #16213e; color: #fff; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }}
  td {{ font-size: 14px; }}
  tr:nth-child(even) td {{ background: #f7f8fc; }}
  .total-row td {{ font-weight: 700; border-top: 2px solid #16213e; background: #eef1f9; }}
  .footer {{ margin-top: 32px; padding-top: 14px; border-top: 1px solid #ccc; font-size: 11px; color: #999; }}
</style>
</head>
<body>
<div class="header">
  <h1>TaxSight Summary Report</h1>
  <p>Official tax calculation summary — generated on {generated_date}</p>
</div>

<div class="info-grid">
  <div class="info-item">
    <label>Account</label>
    <span>{current_user.email}</span>
  </div>
  <div class="info-item">
    <label>Tax Year</label>
    <span>{s['tax_year']}</span>
  </div>
  <div class="info-item">
    <label>Filing Status</label>
    <span>{s['status']}</span>
  </div>
  <div class="info-item">
    <label>Date Generated</label>
    <span>{generated_date}</span>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Amount (USD)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Gross Income</td>
      <td>${s['gross_income']:,.2f}</td>
    </tr>
    <tr>
      <td>Total Deductions</td>
      <td>${s['total_deductions']:,.2f}</td>
    </tr>
    <tr>
      <td>Estimated Tax</td>
      <td>${s['estimated_tax']:,.2f}</td>
    </tr>
    <tr>
      <td>Estimated Refund</td>
      <td>${s['estimated_refund']:,.2f}</td>
    </tr>
    <tr>
      <td>Effective Tax Rate</td>
      <td>{effective_tax_rate}%</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  TaxSight AI &copy; {datetime.now(timezone.utc).year} — This document is computer-generated and does not require a signature.
</div>
</body>
</html>"""

    pdf_bytes = HTML(string=html).write_pdf()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=taxsight-summary-{summary_id}.pdf"
        },
    )
