package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * DTO representing a previous suggestion (lightweight version for suggestion generation context).
 */
public record CompleteSuggestionDto(
        UUID id,
        String name,
        Boolean isFavorite,
        String status,
        Set<UUID> garmentIds,
        OffsetDateTime createdAt
) {
    // TODO: add fromEntity(SuggestionEntity) if direct mapping from persistence layer is needed
}

