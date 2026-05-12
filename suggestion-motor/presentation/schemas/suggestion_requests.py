from pydantic import BaseModel
from typing import List, Optional


class UserLocation(BaseModel):
    latitude: float
    longitude: float


class Preferences(BaseModel):
    config_uuid: Optional[str]
    score: Optional[float]
    colors: Optional[List[str]] = []
    categories: Optional[List[str]] = []
    brands_preferred: Optional[List[str]] = []
    styles: Optional[List[str]] = []


class Garment(BaseModel):
    uuid: str
    type: Optional[str]
    color: Optional[str]
    warm_index: Optional[int]
    style: Optional[str]


class Rejection(BaseModel):
    outfit_uuid: str
    garments: List[str]
    reason_uuid: Optional[str]
    custom_reason: Optional[str]


class History(BaseModel):
    rejections: Optional[List[Rejection]] = []


class SuggestionRequest(BaseModel):
    user_location: UserLocation
    expected_outfits: Optional[int] = 3
    preferences: Optional[Preferences]
    garments: List[Garment]
    history: Optional[History]
