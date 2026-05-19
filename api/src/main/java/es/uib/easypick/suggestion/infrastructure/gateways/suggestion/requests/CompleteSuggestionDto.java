package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import es.uib.easypick.suggestion.application.entities.SuggestionEntity;

/**
 * DTO representing a previous suggestion (lightweight version for suggestion generation context).
 */
public record CompleteSuggestionDto(
        UUID id,
        String name,
        Boolean isFavorite,
        String status,
        Set<UUID> garmentIds,
        OffsetDateTime createdAt,
        RejectionDto rejection
) {
    /**
     * Rejection details for a suggestion.
     */
    public record RejectionDto(
            UUID id,
            String name,
            String customReason
    ) {}

    // Map from SuggestionEntity
    public static CompleteSuggestionDto fromEntity(SuggestionEntity suggestion) {
        if (suggestion == null) return null;

        var rejectionEntity = suggestion.getRejection();
        RejectionDto rejectionDto = null;
        if (rejectionEntity != null) {
            var reason = rejectionEntity.getReason();
            rejectionDto = new RejectionDto(
                    reason != null ? reason.getId() : null,
                    reason != null ? reason.getName() : null,
                    rejectionEntity.getCustomReason()
            );
        }

        var garmentIds = suggestion.getGarmentSuggestions().stream()
                .map(gs -> gs.getGarment().getId())
                .collect(Collectors.toSet());

        return new CompleteSuggestionDto(
                suggestion.getId(),
                suggestion.getName(),
                suggestion.getIsFavorite(),
                suggestion.getStatus() != null ? suggestion.getStatus().name() : null,
                garmentIds,
                suggestion.getCreatedAt(),
                rejectionDto
        );
    }
}

