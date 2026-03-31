package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.garment.application.entities.BrandEntity;
import es.uib.easypick.garment.application.entities.CategoryEntity;
import es.uib.easypick.garment.application.entities.ColorEntity;
import es.uib.easypick.garment.application.entities.StyleEntity;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
import es.uib.easypick.garment.presentation.dtos.responses.ConfigurationsResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetGarmentConfigurationsUseCaseTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private ColorRepository colorRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private StyleRepository styleRepository;

    @InjectMocks
    private GetGarmentConfigurationsUseCase useCase;

    private BrandEntity mockBrand;
    private ColorEntity mockColor;
    private CategoryEntity mockCategory;
    private StyleEntity mockStyle;

    @BeforeEach
    void setUp() {
        // Init mock empty entities
        mockBrand = new BrandEntity();
        mockColor = new ColorEntity();
        mockCategory = new CategoryEntity();
        mockStyle = new StyleEntity();
    }

    @Test
    void execute_ShouldReturnPopulatedConfigurations_WhenRepositoriesHaveData() {
        // Arrange
        when(brandRepository.findAll()).thenReturn(List.of(mockBrand));
        when(colorRepository.findAll()).thenReturn(List.of(mockColor));
        when(categoryRepository.findAll()).thenReturn(List.of(mockCategory));
        when(styleRepository.findAll()).thenReturn(List.of(mockStyle));

        // Act
        ConfigurationsResponse result = useCase.execute();

        // Assert
        assertNotNull(result, "The configurations response should never be null");

        // Verify lists are populated and not null
        assertNotNull(result.brands(), "The brands list should not be null");
        assertEquals(1, result.brands().size(), "The size of brands should match the repository result");

        assertNotNull(result.colors(), "The colors list should not be null");
        assertEquals(1, result.colors().size(), "The size of colors should match the repository result");

        assertNotNull(result.categories(), "The categories list should not be null");
        assertEquals(1, result.categories().size(), "The size of categories should match the repository result");

        assertNotNull(result.styles(), "The styles list should not be null");
        assertEquals(1, result.styles().size(), "The size of styles should match the repository result");

        // Verify repository interaction
        verify(brandRepository, times(1)).findAll();
        verify(colorRepository, times(1)).findAll();
        verify(categoryRepository, times(1)).findAll();
        verify(styleRepository, times(1)).findAll();
    }

    @Test
    void execute_ShouldReturnEmptyLists_WhenRepositoriesAreEmpty() {
        // Arrange
        when(brandRepository.findAll()).thenReturn(Collections.emptyList());
        when(colorRepository.findAll()).thenReturn(Collections.emptyList());
        when(categoryRepository.findAll()).thenReturn(Collections.emptyList());
        when(styleRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        ConfigurationsResponse result = useCase.execute();

        // Assert
        assertNotNull(result, "The configurations response should never be null");

        // Verify lists are empty but not null
        assertTrue(result.brands().isEmpty(), "The brands list should be empty");
        assertTrue(result.colors().isEmpty(), "The colors list should be empty");
        assertTrue(result.categories().isEmpty(), "The categories list should be empty");
        assertTrue(result.styles().isEmpty(), "The styles list should be empty");

        // Verify repository interaction
        verify(brandRepository, times(1)).findAll();
        verify(colorRepository, times(1)).findAll();
        verify(categoryRepository, times(1)).findAll();
        verify(styleRepository, times(1)).findAll();
    }
}