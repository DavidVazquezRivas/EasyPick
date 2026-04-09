package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.CategoryEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.CategoryTestBuilder;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.CategoryRepository;
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
class GarmentUpdateCategoryCommandTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private GarmentEntity garmentMock;

    @InjectMocks
    private GarmentUpdateCategoryCommand command;

    @Test
    void shouldReturnCorrectFieldName() {
        assertEquals("category", command.getFieldName(), "The field name should be 'category'");
    }

    @Test
    void shouldUpdateCategory_whenIdIsValid() {
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        UUID categoryId = UUID.randomUUID();
        CategoryEntity mockCategory = CategoryTestBuilder.aCategory().withId(categoryId).build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(mockCategory));

        command.execute(garment, categoryId.toString());

        assertEquals(mockCategory, garment.getCategory());
    }

    @Test
    void shouldThrowException_whenCategoryNotFound() {
        UUID categoryId = UUID.randomUUID();
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garmentMock, categoryId.toString()));

        assertEquals(ErrorCode.CATEGORY_NOT_FOUND, exception.getErrorCode());
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
    void shouldSetCategoryToNull_whenValueIsNull() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act
        command.execute(garment, null);

        // Assert
        assertNull(garment.getCategory());
        verifyNoInteractions(categoryRepository);
    }
}