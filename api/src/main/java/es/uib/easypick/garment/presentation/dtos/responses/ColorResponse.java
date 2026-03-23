package es.uib.easypick.garment.presentation.dtos.responses;

import es.uib.easypick.garment.application.entities.ColorEntity;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ColorResponse(
        UUID id,
        String name,
        String hexCode
) {
    public static ColorResponse fromEntity(ColorEntity entity) {
        return ColorResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .hexCode(entity.getHexCode())
                .build();
    }
}
