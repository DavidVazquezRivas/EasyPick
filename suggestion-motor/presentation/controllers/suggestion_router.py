from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_llm_provider, get_weather_provider
from presentation.schemas.suggestion_requests import SuggestionRequest
from presentation.schemas.suggestion_responses import SuggestionResponse
from application.usecases.generate_outfits_usecase import generate_outfits

router = APIRouter()


@router.post("/generate", response_model=SuggestionResponse)
async def generate(request: SuggestionRequest, llm=Depends(get_llm_provider), weather=Depends(get_weather_provider)):
    try:
        resp = await generate_outfits(llm, request, weather_provider=weather)
        return resp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
