"""Supabase database client — replaces SQLAlchemy."""
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
