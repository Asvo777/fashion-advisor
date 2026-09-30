from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ClothingCategory(StrEnum):
	HEAD = "HEAD"
	INNER_TOP = "INNER_TOP"
	OUTER_TOP = "OUTER_TOP"
	BOTTOM = "BOTTOM"
	INNER_FEET = "INNER_FEET"
	OUTER_FEET = "OUTER_FEET"
	SPECIAL_ITEM = "SPECIAL_ITEM"


class WeatherBias(StrEnum):
	HOT = "HOT"
	COLD = "COLD"
	ANY = "ANY"


class ClothingSize(StrEnum):
	SLIM = "SLIM"
	SMALL = "SMALL"
	PERFECT = "PERFECT"
	TALL = "TALL"
	BAGGY = "BAGGY"


class ClothingItemCreate(BaseModel):
	category: ClothingCategory
	name: str
	main_color: str
	pattern: str | None = None
	weather_bias: WeatherBias = WeatherBias.ANY
	size: ClothingSize = ClothingSize.PERFECT
	is_available: bool = True


class ClothingItem(ClothingItemCreate):
	model_config = ConfigDict(from_attributes=True)

	user_id: UUID
	id: UUID
	created_at: datetime
	updated_at: datetime
