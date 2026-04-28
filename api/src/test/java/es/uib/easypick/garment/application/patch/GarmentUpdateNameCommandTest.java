package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class GarmentUpdateNameCommandTest {

    private final GarmentUpdateNameCommand command = new GarmentUpdateNameCommand();

    @Test
    void shouldReturnCorrectFieldName() {
        assertEquals("name", command.getFieldName(), "The field name should be 'name'");
    }

    @Test
    void shouldUpdateName_whenValueIsValid() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();
        String newName = "Camisa de Lino";

        // Act
        command.execute(garment, newName);

        // Assert
        assertEquals(newName, garment.getName());
    }

    @Test
    void shouldThrowException_whenNameIsNull() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garment, null));

        assertEquals(ErrorCode.INVALID_GARMENT_NAME, exception.getErrorCode());
    }

    @Test
    void shouldThrowException_whenNameIsEmpty() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garment, ""));

        assertEquals(ErrorCode.INVALID_GARMENT_NAME, exception.getErrorCode());
    }

    @Test
    void shouldThrowException_whenNameIsOnlySpaces() {
        // Arrange
        GarmentEntity garment = GarmentTestBuilder.aGarment().build();

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(garment, "   "));

        assertEquals(ErrorCode.INVALID_GARMENT_NAME, exception.getErrorCode());
    }
}