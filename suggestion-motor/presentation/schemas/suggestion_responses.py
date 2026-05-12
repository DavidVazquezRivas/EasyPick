from pydantic import BaseModel
from typing import List


class OutfitGarment(BaseModel):
    uuid: str


class Outfit(BaseModel):
    garments_list: List[OutfitGarment]


class SuggestionResponse(BaseModel):
    outfits: List[Outfit]
