"""Authentication API endpoints — Supabase Auth backend."""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database import get_supabase
from app.core.security import get_current_user
from app.schemas.auth import UserCreate, UserResponse

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

    user_data = {
        "id": auth_response.user.id,
        "email": auth_response.user.email,
        "full_name": payload.full_name,
        "tier": "free",
    }

    # Insert into our public.users table via supabase-py
    supabase.table("users").insert(user_data).execute()

    return {
        "access_token": auth_response.session.access_token if auth_response.session else None,
        "token_type": "bearer",
        "user": user_data,
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

    # Fetch our user record
    user_result = supabase.table("users").select("*").eq("id", auth_response.user.id).execute()
    user_data = user_result.data[0] if user_result.data else {}

    return {
        "access_token": auth_response.session.access_token,
        "token_type": "bearer",
        "user": {
            "id": auth_response.user.id,
            "email": auth_response.user.email,
            "full_name": user_data.get("full_name", ""),
            "tier": user_data.get("tier", "free"),
        },
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    """Return the authenticated user's profile."""
    supabase = get_supabase()
    user_result = supabase.table("users").select("*").eq("id", current_user.id).execute()
    if not user_result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate({
        "id": current_user.id,
        "email": current_user.email,
        "full_name": user_result.data[0].get("full_name", ""),
        "tier": user_result.data[0].get("tier", "free"),
        "created_at": user_result.data[0].get("created_at"),
    })
