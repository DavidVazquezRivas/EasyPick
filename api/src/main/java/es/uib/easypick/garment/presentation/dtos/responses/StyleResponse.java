package es.uib.easypick.garment.presentation.dtos.responses;

import es.uib.easypick.garment.application.entities.StyleEntity;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record StyleResponse(
        UUID id,
        String name,
        String description
) {
    public static StyleResponse fromEntity(StyleEntity entity) {
        return StyleResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }
}
