package es.uib.easypick.garment.presentation.dtos.responses;

import es.uib.easypick.garment.application.entities.BrandEntity;
import lombok.Builder;

import java.util.UUID;

@Builder
public record BrandResponse(
        UUID id,
        String name
) {
    public static BrandResponse fromEntity(BrandEntity entity) {
        return BrandResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
