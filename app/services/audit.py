"""Audit logging utilities — Supabase REST backend."""
from fastapi import Request
from app.core.database import rest_insert


def log_action(
    user_id: int | None,
    action: str,
    resource_type: str | None = None,
    resource_id: str | None = None,
    details: dict | None = None,
    ip_address: str | None = None,
) -> None:
    """Record an auditable action to Supabase."""
    try:
        rest_insert("audit_logs", {
            "user_id": user_id,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details,
            "ip_address": ip_address,
        })
    except Exception:
        pass  # audit failures should never break the main flow


def get_client_ip(request: Request) -> str | None:
    """Extract client IP from request headers."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None
