package es.uib.easypick.garment.application.mappers;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentLabelPrediction;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorResponse;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GarmentProcessorClassificationMapper {

    private final BrandRepository brandRepository;
    private final StyleRepository styleRepository;
    private final CategoryRepository categoryRepository;
    private final ColorRepository colorRepository;

    public void applyClassification(GarmentEntity garment, GarmentProcessorResponse processorResponse) {
        if (garment == null || processorResponse == null) {
            return;
        }

        resolveLabel(processorResponse.brand())
                .flatMap(brandRepository::findByNameIgnoreCase)
                .ifPresent(garment::setBrand);

        resolveLabel(processorResponse.style())
                .flatMap(styleRepository::findByNameIgnoreCase)
                .ifPresent(garment::setStyle);

        resolveLabel(processorResponse.category())
                .flatMap(categoryRepository::findByNameIgnoreCase)
                .ifPresent(garment::setCategory);

        resolveLabel(processorResponse.color())
                .flatMap(colorRepository::findByNameIgnoreCase)
                .ifPresent(garment::addColor);
    }

    private java.util.Optional<String> resolveLabel(GarmentLabelPrediction prediction) {
        if (prediction == null) {
            return java.util.Optional.empty();
        }

        String value = prediction.label();
        if (value == null) {
            return java.util.Optional.empty();
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? java.util.Optional.empty() : java.util.Optional.of(normalized);
    }
}
