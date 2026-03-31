package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import es.uib.easypick.garment.presentation.dtos.responses.*;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class GetGarmentConfigurationsUseCase {
    private final BrandRepository brandRepository;
    private final ColorRepository colorRepository;
    private final CategoryRepository categoryRepository;
    private final StyleRepository styleRepository;

    @Transactional(readOnly = true)
    public ConfigurationsResponse execute() {
        return ConfigurationsResponse.builder()
                .brands(brandRepository.findAll().stream().map(BrandResponse::fromEntity).toList())
                .colors(colorRepository.findAll().stream().map(ColorResponse::fromEntity).toList())
                .categories(categoryRepository.findAll().stream().map(CategoryResponse::fromEntity).toList())
                .styles(styleRepository.findAll().stream().map(StyleResponse::fromEntity).toList())
                .build();
    }
}
