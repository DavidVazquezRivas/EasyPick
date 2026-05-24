from pydantic import BaseModel
from typing import Optional


class Garment(BaseModel):
    """Dominio: Prenda con características físicas y estilísticas."""
    uuid: str
    type: Optional[str] = None
    color: Optional[str] = None
    warm_index: float  # 0.00 - 10.00, higher = warmer
    style: Optional[str] = None
    brand: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True
