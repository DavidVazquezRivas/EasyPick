package es.uib.easypick.garment.presentation.dtos.responses;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Builder
public record SimpleGarmentResponse(
        UUID id,
        String name,
        String description,
        String imageUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        StyleResponse style,
        CategoryResponse category,
        Set<ColorResponse> colors
) {
    public static SimpleGarmentResponse fromEntity(GarmentEntity entity) {
        return SimpleGarmentResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .style(Optional.ofNullable(entity.getStyle())
                        .map(StyleResponse::fromEntity)
                        .orElse(null))
                .category(Optional.ofNullable(entity.getCategory())
                        .map(CategoryResponse::fromEntity)
                        .orElse(null))
                .colors(Optional.ofNullable(entity.getColors())
                        .map(colors -> colors.stream()
                                .map(ColorResponse::fromEntity)
                                .collect(Collectors.toSet()))
                        .orElse(Set.of()))
                .build();
    }
}
