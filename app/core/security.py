"""Supabase Auth — replaces custom JWT and password utilities.
Returns the local user record (from public.users) with integer IDs."""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_supabase, fetch_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Validate a Supabase JWT and return the local user record (with integer id)."""
    supabase = get_supabase()
    try:
        auth_user = supabase.auth.get_user(token)
        if not auth_user or not auth_user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            )

        # Map the auth UUID to our local user record (integer id)
        email = auth_user.user.email
        local_user = fetch_user_by_email(email)
        if not local_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found in local database",
            )

        return local_user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
