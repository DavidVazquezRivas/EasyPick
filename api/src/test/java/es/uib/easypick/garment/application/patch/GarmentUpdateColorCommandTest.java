package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.ColorEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.ColorTestBuilder;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.ColorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GarmentUpdateColorCommandTest {

    @Mock
    private ColorRepository colorRepository;

    @Mock
    private GarmentEntity garmentMock;

    @InjectMocks
    private GarmentUpdateColorCommand command;

    @Test
    void shouldReturnCorrectFieldName() {
        assertEquals("colors", command.getFieldName(), "The field name should be 'colors'");
    }

    @Test
    void shouldUpdateColors_whenIdsAreValid() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        UUID colorId = UUID.randomUUID();
        ColorEntity mockColor = ColorTestBuilder.aColor().withId(colorId).build();

        when(colorRepository.findAllById(anyList())).thenReturn(List.of(mockColor));

        // Act
        command.execute(garment, List.of(colorId.toString()));

        // Assert
        assertTrue(garment.getColors().contains(mockColor));
        assertEquals(1, garment.getColors().size());
    }

    @Test
    void shouldThrowException_whenAnyColorNotFound() {
        // Arrange
        List<String> inputIds = List.of(UUID.randomUUID().toString());
        when(colorRepository.findAllById(anyList())).thenReturn(Collections.emptyList());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garmentMock, inputIds));

        assertEquals(ErrorCode.COLOR_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void shouldThrowException_whenValueIsInvalidIdFormat() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garmentMock, List.of("INVALID_UUID_FORMAT")));

        assertEquals(ErrorCode.INVALID_UUID_FORMAT, exception.getErrorCode());
        verifyNoInteractions(garmentMock);
    }

    @Test
    void shouldClearColors_whenListIsEmpty() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        when(colorRepository.findAllById(anyList())).thenReturn(Collections.emptyList());

        // Act
        command.execute(garment, Collections.emptyList());

        // Assert
        assertTrue(garment.getColors().isEmpty());
    }

    @Test
    void shouldSetColorsToEmpty_whenValueIsNull() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act
        command.execute(garment, null);

        // Assert
        assertTrue(garment.getColors().isEmpty(), "Colors should be cleared when value is null");
        verifyNoInteractions(colorRepository);
    }
}