package es.uib.easypick.garment.presentation.dtos.responses;

import es.uib.easypick.garment.application.entities.CategoryEntity;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record CategoryResponse(
        UUID id,
        String name,
        String description
) {
    public static CategoryResponse fromEntity(CategoryEntity entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }
}
