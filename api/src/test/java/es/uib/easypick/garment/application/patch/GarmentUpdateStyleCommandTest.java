package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.StyleEntity;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.application.helpers.StyleTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.StyleRepository;
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
class GarmentUpdateStyleCommandTest {

    @Mock
    private StyleRepository styleRepository;

    @Mock
    private GarmentEntity garmentMock;

    @InjectMocks
    private GarmentUpdateStyleCommand command;

    @Test
    void shouldReturnCorrectFieldName() {
        // Assert
        assertEquals("style", command.getFieldName(), "The field name should be 'style'");
    }

    @Test
    void shouldUpdateStyle_whenIdIsValid() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        UUID styleId = UUID.randomUUID();
        StyleEntity mockStyle = StyleTestBuilder.aStyle().withId(styleId).build();

        when(styleRepository.findById(styleId)).thenReturn(Optional.of(mockStyle));

        // Act
        command.execute(garment, styleId.toString());

        // Assert
        assertEquals(mockStyle, garment.getStyle(), "The garment style should be updated");
        verify(styleRepository).findById(styleId);
    }

    @Test
    void shouldThrowException_whenStyleNotFound() {
        // Arrange
        UUID styleId = UUID.randomUUID();
        when(styleRepository.findById(styleId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garmentMock, styleId.toString()));

        assertEquals(ErrorCode.STYLE_NOT_FOUND, exception.getErrorCode());
        verify(styleRepository).findById(styleId);
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
    void shouldSetStyleToNull_whenValueIsNull() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act
        command.execute(garment, null);

        // Assert
        assertNull(garment.getStyle());
        verifyNoInteractions(styleRepository);
    }
}