package es.uib.easypick.suggestion.application.usecases.responses;

import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;

import java.util.List;
import java.util.UUID;

public record GeneratedSuggestionResponse(
        UUID id,
        String name,
        List<CompleteGarmentResponse> garments,
        String status
) {
}

