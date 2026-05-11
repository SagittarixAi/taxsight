"""Authentication API endpoints — Supabase Auth backend."""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database import get_supabase, rest_insert, fetch_user_by_email
from app.core.security import get_current_user
from app.schemas.auth import UserCreate, UserResponse
from app.services.audit import log_action, get_client_ip

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, request: Request):
    """Register a new user via Supabase Auth."""
    supabase = get_supabase()
    try:
        auth_response = supabase.auth.sign_up(
            {"email": payload.email, "password": payload.password}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    auth_user = auth_response.user
    auth_id = auth_user.id

    rows = rest_insert("users", {
        "email": auth_user.email,
        "full_name": payload.full_name,
        "tier": "free",
        "auth_id": auth_id,
    })
    user_data = rows[0] if rows else {}

    log_action(
        user_id=auth_id,
        action="user.register",
        resource_type="user",
        resource_id=str(auth_id),
        ip_address=get_client_ip(request),
    )

    access_token = auth_response.session.access_token if auth_response.session else None

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_data.get("id"),
            "email": auth_user.email,
            "full_name": payload.full_name,
            "tier": user_data.get("tier", "free"),
        },
    }


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), request: Request = None):
    """Login via Supabase Auth."""
    supabase = get_supabase()
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": form_data.username, "password": form_data.password}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    auth_user = auth_response.user
    user_data = fetch_user_by_email(auth_user.email)

    log_action(
        user_id=auth_user.id,
        action="user.login",
        resource_type="user",
        resource_id=str(auth_user.id),
        ip_address=get_client_ip(request) if request else None,
    )

    return {
        "access_token": auth_response.session.access_token,
        "token_type": "bearer",
        "user": {
            "id": user_data.get("id"),
            "email": auth_user.email,
            "full_name": user_data.get("full_name", ""),
            "tier": user_data.get("tier", "free"),
        },
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    """Return the authenticated user's profile."""
    user_data = fetch_user_by_email(current_user.email)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse.model_validate({
        "id": user_data["id"],
        "email": current_user.email,
        "full_name": user_data.get("full_name", ""),
        "tier": user_data.get("tier", "free"),
        "created_at": user_data.get("created_at"),
    })
