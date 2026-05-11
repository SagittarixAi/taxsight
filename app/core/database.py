"""Supabase database client with REST API helpers."""
from typing import Any
import httpx

from supabase import create_client, Client
from app.core.config import settings

_supabase: Client | None = None


def get_supabase() -> Client:
    """Return a singleton Supabase client (service_role for backend access)."""
    global _supabase
    if _supabase is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set"
            )
        _supabase = create_client(
            settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
        )
    return _supabase


# ─── Raw REST helpers (bypass RLS via service_role key) ────

def _headers() -> dict[str, str]:
    """Service-role HTTP headers for raw REST calls."""
    supabase = get_supabase()
    return {
        "apikey": supabase.supabase_key,
        "Authorization": f"Bearer {supabase.supabase_key}",
        "Content-Type": "application/json",
    }


def rest_get(
    table: str,
    params: dict[str, str] | None = None,
) -> list[dict[str, Any]]:
    """GET rows from a Supabase table via service_role REST."""
    supabase = get_supabase()
    resp = httpx.get(
        f"{supabase.supabase_url}/rest/v1/{table}",
        headers=_headers(),
        params=params,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def rest_insert(
    table: str,
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    """INSERT a row via service_role REST, returns the created record."""
    supabase = get_supabase()
    headers = _headers()
    headers["Prefer"] = "return=representation"
    resp = httpx.post(
        f"{supabase.supabase_url}/rest/v1/{table}",
        headers=headers,
        json=data,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def rest_delete(table: str, column: str, value: Any) -> None:
    """DELETE rows matching column==value via service_role REST."""
    supabase = get_supabase()
    resp = httpx.delete(
        f"{supabase.supabase_url}/rest/v1/{table}",
        headers=_headers(),
        params={column: f"eq.{value}"},
        timeout=15,
    )
    resp.raise_for_status()


def rest_update(
    table: str,
    column: str,
    value: Any,
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    """UPDATE rows matching column==value via service_role REST."""
    supabase = get_supabase()
    headers = _headers()
    headers["Prefer"] = "return=representation"
    resp = httpx.patch(
        f"{supabase.supabase_url}/rest/v1/{table}",
        headers=headers,
        params={column: f"eq.{value}"},
        json=data,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_user_by_email(email: str) -> dict[str, Any]:
    """Shortcut: fetch a single user row from public.users by email."""
    rows = rest_get("users", {"email": f"eq.{email}", "select": "id,email,full_name,tier"})
    return rows[0] if rows else {}
