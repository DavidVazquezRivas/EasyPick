package es.uib.easypick.suggestion.presentation.controllers;

import es.uib.easypick.core.presentation.web.resolvers.AuthenticatedUserId;
import es.uib.easypick.core.presentation.web.response.ApiResponse;
import es.uib.easypick.suggestion.application.usecases.GenerateSuggestionsUseCase;
import es.uib.easypick.suggestion.application.usecases.responses.GeneratedSuggestionResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/suggestions")
@RequiredArgsConstructor
@Tag(name = "Suggestion", description = "Endpoints related to suggestions")
public class SuggestionController {

    private final GenerateSuggestionsUseCase generateSuggestionsUseCase;

    @GetMapping
    @Operation(
            summary = "Get suggestions",
            description = "Retrieves outfit suggestions for the authenticated user using the provided location."
    )
    public ResponseEntity<ApiResponse<List<GeneratedSuggestionResponse>>> generateSuggestions(
            @AuthenticatedUserId UUID userId,
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        List<GeneratedSuggestionResponse> response = generateSuggestionsUseCase.execute(userId, new LocationDto(lat, lng));

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}


