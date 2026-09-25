from fastapi import APIRouter, HTTPException

from app.db import supabase
from app.schemas.clothing import ClothingItem, ClothingItemCreate

router = APIRouter(prefix="/api/clothing-items", tags=["clothing"])


@router.get("", response_model=list[ClothingItem])
def list_clothing_items():
    result = supabase.table("clothing_items").select("*").execute()

    if result.data is None:
        raise HTTPException(
            status_code=500,
            detail="Could not load clothing items",
        )

    return result.data


@router.post("", response_model=ClothingItem)
def create_clothing_item(item: ClothingItemCreate):
    result = (
        supabase
        .table("clothing_items")
        .insert(item.model_dump(mode="json"))
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not create clothing item",
        )

    return result.data[0]