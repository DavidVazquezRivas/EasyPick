from pydantic import BaseModel
from typing import List
from application.entities.garment import Garment


class Outfit(BaseModel):
    """Dominio: Conjunto de prendas (outfit)."""
    garments: List[Garment]
    
    class Config:
        arbitrary_types_allowed = True
