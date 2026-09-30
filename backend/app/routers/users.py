from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.db import supabase
from app.schemas.user import UserProfile, UserProfileUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserProfile)
def create_user_profile(current_user=Depends(get_current_user)):
    result = (
        supabase
        .table("users")
        .upsert({
            "id": str(current_user.id),
            "email": current_user.email,
        })
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Could not create profile")

    return result.data[0]


@router.patch("/{user_id}/profile", response_model=UserProfile)
def update_user_profile(
    user_id: UUID,
    profile: UserProfileUpdate,
    current_user=Depends(get_current_user),
):
    if str(user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden")

    result = (
        supabase
        .table("users")
        .update(profile.model_dump(exclude_unset=True, mode="json"))
        .eq("id", str(current_user.id))
        .select("*")
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data