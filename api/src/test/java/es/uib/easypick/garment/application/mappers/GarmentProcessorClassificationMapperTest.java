package es.uib.easypick.garment.application.mappers;

import es.uib.easypick.garment.application.entities.*;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentLabelPrediction;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorResponse;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GarmentProcessorClassificationMapperTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private StyleRepository styleRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ColorRepository colorRepository;

    @InjectMocks
    private GarmentProcessorClassificationMapper mapper;

    @Test
    void applyClassification_ShouldMapAllMatchingFields() {
        GarmentEntity garment = new GarmentEntity();

        BrandEntity brand = new BrandEntity();
        brand.setName("Gucci");
        StyleEntity style = new StyleEntity();
        style.setName("formal");
        CategoryEntity category = new CategoryEntity();
        category.setName("shoes");
        ColorEntity color = new ColorEntity();
        color.setName("black");
        color.setHexCode("#000000");

        GarmentProcessorResponse response = new GarmentProcessorResponse(
                "tmp-1",
                0.92,
                new GarmentLabelPrediction("shoes", 0.88),
                new GarmentLabelPrediction("black", 0.91),
                new GarmentLabelPrediction("formal", 0.84),
                new GarmentLabelPrediction("leather", 0.8),
                new GarmentLabelPrediction("spring", 0.8),
                new GarmentLabelPrediction("Gucci", 0.9),
                "base64"
        );

        when(brandRepository.findByNameIgnoreCase("Gucci")).thenReturn(Optional.of(brand));
        when(styleRepository.findByNameIgnoreCase("formal")).thenReturn(Optional.of(style));
        when(categoryRepository.findByNameIgnoreCase("shoes")).thenReturn(Optional.of(category));
        when(colorRepository.findByNameIgnoreCase("black")).thenReturn(Optional.of(color));

        mapper.applyClassification(garment, response);

        assertEquals(brand, garment.getBrand());
        assertEquals(style, garment.getStyle());
        assertEquals(category, garment.getCategory());
        assertTrue(garment.getColors().contains(color));
    }

    @Test
    void applyClassification_ShouldIgnoreMissingMatchesAndNullLabels() {
        GarmentEntity garment = new GarmentEntity();

        GarmentProcessorResponse response = new GarmentProcessorResponse(
                "tmp-1",
                0.92,
                new GarmentLabelPrediction("unknown-category", 0.88),
                null,
                new GarmentLabelPrediction("", 0.84),
                null,
                null,
                new GarmentLabelPrediction("unknown-brand", 0.9),
                "base64"
        );

        when(brandRepository.findByNameIgnoreCase("unknown-brand")).thenReturn(Optional.empty());
        when(categoryRepository.findByNameIgnoreCase("unknown-category")).thenReturn(Optional.empty());

        mapper.applyClassification(garment, response);

        assertNull(garment.getBrand());
        assertNull(garment.getStyle());
        assertNull(garment.getCategory());
        assertTrue(garment.getColors().isEmpty());
    }
}
