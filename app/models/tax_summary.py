"""Tax summary model."""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base


class TaxSummary(Base):
    __tablename__ = "tax_summaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tax_year = Column(Integer, nullable=False)
    gross_income = Column(Float, default=0.0)
    total_deductions = Column(Float, default=0.0)
    estimated_tax = Column(Float, default=0.0)
    estimated_refund = Column(Float, default=0.0)
    status = Column(String, default="draft")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
