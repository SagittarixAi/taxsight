"""Audit logging utilities."""
from datetime import datetime, timezone
from fastapi import Request
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.core.database import SessionLocal


def log_action(
    user_id: int | None,
    action: str,
    resource_type: str | None = None,
    resource_id: str | None = None,
    details: dict | None = None,
    ip_address: str | None = None,
) -> None:
    """Record an auditable action to the database."""
    log = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address,
        created_at=datetime.now(timezone.utc),
    )
    db = SessionLocal()
    try:
        db.add(log)
        db.commit()
    finally:
        db.close()


def get_client_ip(request: Request) -> str | None:
    """Extract client IP from request headers."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None
