package es.uib.easypick.garment.presentation.dtos.responses;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record SimpleGarmentResponse(
        UUID id,
        String name,
        String description,
        String imageUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static SimpleGarmentResponse fromEntity(GarmentEntity entity) {
        return SimpleGarmentResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
