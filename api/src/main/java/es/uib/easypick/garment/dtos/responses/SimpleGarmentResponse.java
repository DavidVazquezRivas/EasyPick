package es.uib.easypick.garment.dtos.responses;

import es.uib.easypick.garment.entities.GarmentEntity;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record SimpleGarmentResponse(
        UUID id,
        String name,
        String description,
        String imageUrl,
        OffsetDateTime updatedAt
) {
    public static SimpleGarmentResponse fromEntity(GarmentEntity entity) {
        return SimpleGarmentResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
