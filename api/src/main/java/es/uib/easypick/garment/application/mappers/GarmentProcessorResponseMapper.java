package es.uib.easypick.garment.application.mappers;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponse;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponseItem;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import es.uib.easypick.user.application.entities.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GarmentProcessorResponseMapper {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ColorRepository colorRepository;
    private final StyleRepository styleRepository;

    @Value("${application.modules.garment.warmth-index-base}")
    private int warmthIndexBase;

    public List<GarmentEntity> toEntities(GarmentProcessorResponse response, UserEntity user) {
        return response.garments()
                .stream()
                .map(item -> toEntity(item, user))
                .toList();
    }

    public GarmentEntity toEntity(GarmentProcessorResponseItem item, UserEntity user) {
        GarmentEntity garment = GarmentEntity.createPendingClassification(user, item.imageBase64());

        if (item.category() != null) {
            categoryRepository.findById(item.category())
                    .ifPresent(garment::setCategory);
        }

        if (item.style() != null) {
            styleRepository.findById(item.style())
                    .ifPresent(garment::setStyle);
        }

        if (item.brand() != null) {
            brandRepository.findById(item.brand())
                    .ifPresent(garment::setBrand);
        }

        if (item.color() != null) {
            colorRepository.findById(item.color())
                    .ifPresent(garment::addColor);
        }

        if (item.warmthIndex() != null) {
            int mappedWarmth = (int) Math.round(item.warmthIndex() * warmthIndexBase);
            garment.setWarmthIndex(mappedWarmth);
        }

        return garment;
    }
}