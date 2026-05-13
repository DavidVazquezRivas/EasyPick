from fastapi import APIRouter, Depends, HTTPException
from core.dependencies import get_llm_provider, get_weather_provider
from presentation.schemas.suggestion_requests import SuggestionContextRequest, map_to_usecase_request
from presentation.schemas.suggestion_responses import SuggestionGatewayResponse, map_to_gateway_response
from presentation.helpers.preference_formatter import format_preferences_for_prompt, format_rejected_combinations_for_prompt
from application.usecases.generate_outfits_usecase import generate_outfits

router = APIRouter()


@router.post("", response_model=SuggestionGatewayResponse)
async def generate(request: SuggestionContextRequest, llm=Depends(get_llm_provider), weather=Depends(get_weather_provider)):
    try:
        usecase_request = map_to_usecase_request(request)
        
        # Preparar contexto enriquecido para prompting: preferencias y rechazos previos
        preferences_context = format_preferences_for_prompt(request)
        
        rejected_combos = []
        if usecase_request.history and usecase_request.history.rejections:
            rejected_combos = [r.garments for r in usecase_request.history.rejections]
        rejections_context = format_rejected_combinations_for_prompt(rejected_combos)
        
        usecase_response = await generate_outfits(
            llm,
            usecase_request,
            weather_provider=weather,
            preferences_context=preferences_context,
            rejections_context=rejections_context,
        )
        return map_to_gateway_response(usecase_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
