package es.uib.easypick.garment.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GarmentUpdateStatusCommandTest {

    private GarmentUpdateStatusCommand command;

    @Mock
    private GarmentEntity garmentMock;

    @BeforeEach
    void setUp() {
        command = new GarmentUpdateStatusCommand();
    }

    @Test
    void shouldReturnCorrectFieldName() {
        // Assert
        assertEquals("status", command.getFieldName(), "The field name should be 'status'");
    }

    @Test
    void shouldThrowException_whenValueIsNull() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            command.execute(garmentMock, null);
        });

        assertEquals(ErrorCode.INVALID_GARMENT_STATUS, exception.getErrorCode());
        // Verify the domain entity was never touched
        verifyNoInteractions(garmentMock);
    }

    @Test
    void shouldThrowException_whenValueIsInvalidString() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            command.execute(garmentMock, "INVALID_STATUS_NAME");
        });

        assertEquals(ErrorCode.INVALID_GARMENT_STATUS, exception.getErrorCode());
        verifyNoInteractions(garmentMock);
    }

    @Test
    void shouldThrowException_whenStatusIsPending() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            command.execute(garmentMock, "PENDING");
        });

        assertEquals(ErrorCode.INVALID_GARMENT_STATUS, exception.getErrorCode());
        verifyNoInteractions(garmentMock);
    }

    @Test
    void shouldCallConfirm_whenStatusIsConfirmed() {
        // Act
        command.execute(garmentMock, "CONFIRMED");

        // Assert
        verify(garmentMock).confirm();
    }

    @Test
    void shouldCallConfirm_whenStatusIsConfirmed_caseInsensitive() {
        // Act - Testing lower case input
        command.execute(garmentMock, "cOnFiRmEd");

        // Assert
        verify(garmentMock).confirm();
    }

    @Test
    void shouldDoNothing_whenStatusIsDeleted() {
        // Act
        command.execute(garmentMock, "DELETED");

        // Assert
        // Currently, DELETED has no domain logic in the switch statement.
        // We just verify that it doesn't throw an error and doesn't call confirm.
        verify(garmentMock, never()).confirm();
    }
}