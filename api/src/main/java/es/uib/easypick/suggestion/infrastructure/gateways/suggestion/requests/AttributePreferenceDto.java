package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests;

import java.util.UUID;

public record AttributePreferenceDto(UUID id, Integer score) {
}
