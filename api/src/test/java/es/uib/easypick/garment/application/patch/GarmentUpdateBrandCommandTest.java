package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.BrandEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.BrandTestBuilder;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.BrandRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GarmentUpdateBrandCommandTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private GarmentEntity garmentMock;

    @InjectMocks
    private GarmentUpdateBrandCommand command;

    @Test
    void shouldReturnCorrectFieldName() {
        assertEquals("brand", command.getFieldName(), "The field name should be 'brand'");
    }

    @Test
    void shouldUpdateBrand_whenIdIsValid() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        UUID brandId = UUID.randomUUID();
        BrandEntity mockBrand = BrandTestBuilder.aBrand().withId(brandId).build();

        when(brandRepository.findById(brandId)).thenReturn(Optional.of(mockBrand));

        // Act
        command.execute(garment, brandId.toString());

        // Assert
        assertEquals(mockBrand, garment.getBrand());
        verify(brandRepository).findById(brandId);
    }

    @Test
    void shouldThrowException_whenBrandNotFound() {
        // Arrange
        UUID brandId = UUID.randomUUID();
        when(brandRepository.findById(brandId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garmentMock, brandId.toString()));

        assertEquals(ErrorCode.BRAND_NOT_FOUND, exception.getErrorCode());
        verify(brandRepository).findById(brandId);
    }

    @Test
    void shouldThrowException_whenValueIsInvalidIdFormat() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garmentMock, "INVALID_UUID_FORMAT"));

        assertEquals(ErrorCode.INVALID_UUID_FORMAT, exception.getErrorCode());
        verifyNoInteractions(garmentMock);
    }

    @Test
    void shouldSetBrandToNull_whenValueIsNull() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act
        command.execute(garment, null);

        // Assert
        assertNull(garment.getBrand());
        verifyNoInteractions(brandRepository);
    }
}