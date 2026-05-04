package es.uib.easypick.suggestion.presentation.controllers;

import es.uib.easypick.core.presentation.web.resolvers.AuthenticatedUserId;
import es.uib.easypick.core.presentation.web.response.ApiResponse;
import es.uib.easypick.suggestion.application.usecases.GenerateSuggestionsUseCase;
import es.uib.easypick.suggestion.application.usecases.GetRejectionReasonsUseCase;
import es.uib.easypick.suggestion.application.usecases.PatchSuggestionUseCase;
import es.uib.easypick.suggestion.application.usecases.responses.GeneratedSuggestionResponse;
import es.uib.easypick.suggestion.application.usecases.responses.RejectionReasonResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/suggestions")
@RequiredArgsConstructor
@Tag(name = "Suggestion", description = "Endpoints related to suggestions")
public class SuggestionController {

    private final GenerateSuggestionsUseCase generateSuggestionsUseCase;
        private final GetRejectionReasonsUseCase getRejectionReasonsUseCase;
    private final PatchSuggestionUseCase patchSuggestionUseCase;

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

        @GetMapping("/rejection-reasons")
        @Operation(
                        summary = "Get rejection reasons",
                        description = "Returns available reasons to reject a suggestion."
        )
        public ResponseEntity<ApiResponse<List<RejectionReasonResponse>>> getRejectionReasons() {
                List<RejectionReasonResponse> response = getRejectionReasonsUseCase.execute();

                return ResponseEntity.ok(ApiResponse.success(response));
        }

    @PatchMapping("/{suggestionId}")
    @Operation(
            summary = "Update suggestion status",
            description = "Accepts or rejects a suggestion. Use status 'ACCEPTED' to accept, or provide 'rejection' object to reject."
    )
    public ResponseEntity<ApiResponse<Void>> patchSuggestion(
            @PathVariable UUID suggestionId,
            @RequestBody Map<String, Object> patchInstructions
    ) {
        patchSuggestionUseCase.execute(suggestionId, patchInstructions);

        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

