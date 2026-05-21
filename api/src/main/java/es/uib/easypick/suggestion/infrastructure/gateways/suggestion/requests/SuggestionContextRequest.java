package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests;

import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;

import java.util.List;

/**
 * Input DTO representing the context sent to the suggestion gateway/service.
 */
public record SuggestionContextRequest(
        List<AttributePreferenceDto> colorPreferences,
        List<AttributePreferenceDto> brandPreferences,
        List<AttributePreferenceDto> categoryPreferences,
        List<AttributePreferenceDto> stylePreferences,
        List<CompleteGarmentResponse> garments,
        List<CompleteSuggestionDto> previousSuggestions,
        Integer requestedOutfitCount,
        LocationDto location
) {
}
