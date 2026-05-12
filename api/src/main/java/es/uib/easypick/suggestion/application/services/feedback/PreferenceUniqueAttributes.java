package es.uib.easypick.suggestion.application.services.feedback;

import java.util.Set;
import java.util.UUID;

public record PreferenceUniqueAttributes(
        Set<UUID> garmentIds,
        Set<UUID> uniqueColorIds,
        Set<UUID> uniqueBrandsIds,
        Set<UUID> uniqueStyleIds,
        Set<UUID> uniqueCategoryIds
) {
}