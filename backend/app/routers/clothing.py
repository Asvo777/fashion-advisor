from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.db import supabase
from app.schemas.clothing import ClothingItem, ClothingItemCreate

router = APIRouter(prefix="/api/clothing-items", tags=["clothing"])


@router.get("", response_model=list[ClothingItem])
def list_clothing_items(current_user=Depends(get_current_user)):
    result = (
        supabase
        .table("clothing_items")
        .select("*")
        .eq("user_id", str(current_user.id))
        .execute()
    )

    if result.data is None:
        raise HTTPException(
            status_code=500,
            detail="Could not load clothing items",
        )

    return result.data


@router.post("", response_model=ClothingItem)
def create_clothing_item(
    item: ClothingItemCreate,
    current_user=Depends(get_current_user),
):
    payload = item.model_dump(mode="json")
    payload["user_id"] = str(current_user.id)

    result = (
        supabase
        .table("clothing_items")
        .insert(payload)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not create clothing item",
        )

    return result.data[0]