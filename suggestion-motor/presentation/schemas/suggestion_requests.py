from typing import List, Optional

from pydantic import BaseModel, Field


class UserLocation(BaseModel):
    latitude: float
    longitude: float


class Preferences(BaseModel):
    config_uuid: Optional[str] = None
    score: Optional[float] = None
    colors: List[str] = []
    categories: List[str] = []
    brands_preferred: List[str] = []
    styles: List[str] = []


class Garment(BaseModel):
    uuid: str
    type: Optional[str] = None
    color: Optional[str] = None
    warm_index: Optional[int] = None
    style: Optional[str] = None
    brand: Optional[str] = None
    score: Optional[int] = None


class Rejection(BaseModel):
    outfit_uuid: str
    garments: List[str]
    reason_uuid: Optional[str] = None
    custom_reason: Optional[str] = None


class History(BaseModel):
    rejections: List[Rejection] = []


class SuggestionRequest(BaseModel):
    user_location: UserLocation
    expected_outfits: int = 3
    preferences: Optional[Preferences] = None
    garments: List[Garment]
    history: Optional[History] = None


class AttributePreferenceDto(BaseModel):
    id: str
    score: Optional[int] = None


class LocationDto(BaseModel):
    lat: float
    lng: float


class NestedRefDto(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None


class ColorRefDto(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    hexCode: Optional[str] = None


class CompleteGarmentDto(BaseModel):
    id: str
    name: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    brand: Optional[NestedRefDto] = None
    style: Optional[NestedRefDto] = None
    category: Optional[NestedRefDto] = None
    colors: List[ColorRefDto] = []
    score: Optional[int] = None
    warm_index: Optional[int] = Field(default=None, alias="warmthIndex")


class CompleteSuggestionDto(BaseModel):
    id: str
    name: Optional[str] = None
    is_favorite: Optional[bool] = Field(default=None, alias="isFavorite")
    status: Optional[str] = None
    garment_ids: List[str] = Field(default_factory=list, alias="garmentIds")
    created_at: Optional[str] = Field(default=None, alias="createdAt")

    class Config:
        allow_population_by_field_name = True


class SuggestionContextRequest(BaseModel):
    color_preferences: List[AttributePreferenceDto] = Field(default_factory=list, alias="colorPreferences")
    brand_preferences: List[AttributePreferenceDto] = Field(default_factory=list, alias="brandPreferences")
    category_preferences: List[AttributePreferenceDto] = Field(default_factory=list, alias="categoryPreferences")
    style_preferences: List[AttributePreferenceDto] = Field(default_factory=list, alias="stylePreferences")
    garments: List[CompleteGarmentDto] = Field(default_factory=list)
    previous_suggestions: List[CompleteSuggestionDto] = Field(default_factory=list, alias="previousSuggestions")
    requested_outfit_count: int = Field(default=3, alias="requestedOutfitCount")
    location: LocationDto

    class Config:
        allow_population_by_field_name = True


def _extract_ids(items: List[AttributePreferenceDto]) -> List[str]:
    return [item.id for item in items if item.id]


def _map_preferences(request: SuggestionContextRequest) -> Preferences:
    all_scores = [item.score for item in (
        request.color_preferences
        + request.brand_preferences
        + request.category_preferences
        + request.style_preferences
    ) if item.score is not None]

    avg_score = float(sum(all_scores) / len(all_scores)) if all_scores else None
    return Preferences(
        score=avg_score,
        colors=_extract_ids(request.color_preferences),
        categories=_extract_ids(request.category_preferences),
        brands_preferred=_extract_ids(request.brand_preferences),
        styles=_extract_ids(request.style_preferences),
    )


def get_preference_scores_by_type(request: SuggestionContextRequest) -> dict:
    """Extract preference scores keyed by attribute type for LLM prompting."""
    return {
        'colors': {str(item.id): item.score for item in request.color_preferences if item.score},
        'brands': {str(item.id): item.score for item in request.brand_preferences if item.score},
        'categories': {str(item.id): item.score for item in request.category_preferences if item.score},
        'styles': {str(item.id): item.score for item in request.style_preferences if item.score},
    }


def _map_garment(item: CompleteGarmentDto) -> Garment:
    primary_color = item.colors[0].name if item.colors and item.colors[0].name else None
    inferred_type = item.category.name if item.category and item.category.name else None
    style_name = item.style.name if item.style and item.style.name else None
    brand_name = item.brand.name if item.brand and item.brand.name else None
    warm_index = item.warm_index if item.warm_index is not None else 5
    return Garment(
        uuid=item.id,
        type=inferred_type,
        color=primary_color,
        warm_index=warm_index,
        style=style_name,
        brand=brand_name,
        score=item.score,
    )


def _map_history(request: SuggestionContextRequest) -> Optional[History]:
    """Map previous suggestions marked as REJECTED to exclusion history.
    Returns None if no rejections found; otherwise returns History object.
    """
    if not request.previous_suggestions:
        return None
    
    rejections: List[Rejection] = []
    for suggestion in request.previous_suggestions:
        status = (suggestion.status or "").upper()
        if status == "REJECTED" and suggestion.garment_ids:
            rejections.append(
                Rejection(
                    outfit_uuid=suggestion.id,
                    garments=list(suggestion.garment_ids),  # Convert Set to List
                )
            )
    
    return History(rejections=rejections) if rejections else None


def map_to_usecase_request(request: SuggestionContextRequest) -> SuggestionRequest:
    return SuggestionRequest(
        user_location=UserLocation(latitude=request.location.lat, longitude=request.location.lng),
        expected_outfits=request.requested_outfit_count,
        preferences=_map_preferences(request),
        garments=[_map_garment(item) for item in request.garments],
        history=_map_history(request),  # Puede ser None si no hay rechazos previos
    )
