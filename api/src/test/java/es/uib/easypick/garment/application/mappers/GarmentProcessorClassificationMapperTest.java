package es.uib.easypick.garment.application.mappers;

import es.uib.easypick.garment.application.entities.*;
import es.uib.easypick.garment.application.helpers.*;
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
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        BrandEntity brand = BrandTestBuilder.aBrand().withName("Gucci").build();
        StyleEntity style = StyleTestBuilder.aStyle().withName("formal").build();
        CategoryEntity category = CategoryTestBuilder.aCategory().withName("shoes").build();
        ColorEntity color = ColorTestBuilder.aColor().withName("black").withHexCode("#000000").build();

        GarmentProcessorResponse response = GarmentProcessorResponseTestBuilder.aGarmentProcessorResponse()
            .withTempId("tmp-1")
            .withDetectionConfidence(0.92)
            .withCategory(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("shoes").withScore(0.88).build())
            .withColor(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("black").withScore(0.91).build())
            .withStyle(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("formal").withScore(0.84).build())
            .withMaterial(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("leather").withScore(0.8).build())
            .withSeason(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("spring").withScore(0.8).build())
            .withBrand(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("Gucci").withScore(0.9).build())
            .withImageBase64("base64")
            .build();

        when(brandRepository.findByNameIgnoreCase("Gucci")).thenReturn(Optional.of(brand));
        when(styleRepository.findByNameIgnoreCase("formal")).thenReturn(Optional.of(style));
        when(categoryRepository.findByNameIgnoreCase("shoes")).thenReturn(Optional.of(category));
        when(colorRepository.findByNameIgnoreCase("black")).thenReturn(Optional.of(color));

        // Act
        mapper.applyClassification(garment, response);

        // Assert
        assertEquals(brand, garment.getBrand());
        assertEquals(style, garment.getStyle());
        assertEquals(category, garment.getCategory());
        assertTrue(garment.getColors().contains(color));
    }

    @Test
    void applyClassification_ShouldIgnoreMissingMatchesAndNullLabels() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        GarmentProcessorResponse response = GarmentProcessorResponseTestBuilder.aGarmentProcessorResponse()
            .withTempId("tmp-1")
            .withDetectionConfidence(0.92)
            .withCategory(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("unknown-category").withScore(0.88).build())
            .withColor(null)
            .withStyle(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("").withScore(0.84).build())
            .withMaterial(null)
            .withSeason(null)
            .withBrand(GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("unknown-brand").withScore(0.9).build())
            .withImageBase64("base64")
            .build();

        when(brandRepository.findByNameIgnoreCase("unknown-brand")).thenReturn(Optional.empty());
        when(categoryRepository.findByNameIgnoreCase("unknown-category")).thenReturn(Optional.empty());

        // Act
        mapper.applyClassification(garment, response);

        // Assert
        assertNull(garment.getBrand());
        assertNull(garment.getStyle());
        assertNull(garment.getCategory());
        assertTrue(garment.getColors().isEmpty());
    }
}
