from pydantic import BaseModel
from typing import Optional, List
from application.entities.garment import Garment


class Preferences(BaseModel):
    """Preferencias del usuario para generación de outfits."""
    config_uuid: Optional[str] = None
    colors: Optional[List[str]] = []
    categories: Optional[List[str]] = []
    brands_preferred: Optional[List[str]] = []
    styles: Optional[List[str]] = []


class UserContext(BaseModel):
    """Contexto completo del usuario."""
    user_id: Optional[str] = None
    location_latitude: float
    location_longitude: float
    garments: List[Garment]
    preferences: Optional[Preferences] = None
    rejected_outfit_combinations: Optional[List[List[str]]] = []  # List of garment UUID combos to avoid
    
    class Config:
        arbitrary_types_allowed = True
