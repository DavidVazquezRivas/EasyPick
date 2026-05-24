from typing import List

from pydantic import BaseModel, Field


class OutfitGarment(BaseModel):
    uuid: str


class Outfit(BaseModel):
    garments_list: List[OutfitGarment]


class SuggestionResponse(BaseModel):
    outfits: List[Outfit]


class SuggestionGatewayResponseOutfit(BaseModel):
    garment_ids: List[str] = Field(default_factory=list, alias="garmentIds")

    class Config:
        allow_population_by_field_name = True


class SuggestionGatewayResponse(BaseModel):
    outfits: List[SuggestionGatewayResponseOutfit]


def map_to_gateway_response(usecase_response: SuggestionResponse) -> SuggestionGatewayResponse:
    outfits = [
        SuggestionGatewayResponseOutfit(
            garmentIds=[garment.uuid for garment in outfit.garments_list],
        )
        for outfit in usecase_response.outfits
    ]
    return SuggestionGatewayResponse(outfits=outfits)
