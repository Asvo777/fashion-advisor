from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel


class Gender(StrEnum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class BodyType(StrEnum):
    RECTANGLE = "RECTANGLE"
    INVERTED_TRIANGLE = "INVERTED_TRIANGLE"
    PEAR = "PEAR"
    APPLE = "APPLE"
    HOURGLASS = "HOURGLASS"


class UserProfileUpdate(BaseModel):
    age: int | None = None
    gender: Gender | None = None
    body_type: BodyType | None = None
    location_id: UUID | None = None


class UserProfile(BaseModel):
    id: UUID
    email: str
    age: int | None
    gender: Gender | None
    body_type: BodyType | None
    location_id: UUID | None
    created_at: datetime
    updated_at: datetime