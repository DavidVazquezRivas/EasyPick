package es.uib.easypick.garment.presentation.dtos.responses;

import lombok.Builder;

import java.util.List;

@Builder
public record ConfigurationsResponse(
        List<BrandResponse> brands,
        List<ColorResponse> colors,
        List<CategoryResponse> categories,
        List<StyleResponse> styles
) {
}
