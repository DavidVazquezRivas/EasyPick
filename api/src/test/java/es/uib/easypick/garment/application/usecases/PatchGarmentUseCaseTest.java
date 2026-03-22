package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.application.patch.GarmentPatchStrategyContext;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatchGarmentUseCaseTest {

    @Mock
    private GarmentRepository garmentRepository;

    @Mock
    private GarmentPatchStrategyContext patchStrategyContext;

    @InjectMocks
    private PatchGarmentUseCase patchGarmentUseCase;

    private UUID validGarmentId;
    private GarmentEntity existingGarment;
    private Map<String, Object> validPatchInstructions;

    @BeforeEach
    void setUp() {
        validGarmentId = UUID.randomUUID();

        existingGarment = GarmentTestBuilder.aGarment()
                .withId(validGarmentId)
                .withStatus(GarmentStatus.PENDING)
                .build();

        validPatchInstructions = Map.of("status", "CONFIRMED");
    }

    @Test
    void execute_shouldSuccessfullyPatchAndReturnGarment_whenIdExists() {
        // Arrange
        when(garmentRepository.findById(validGarmentId)).thenReturn(Optional.of(existingGarment));

        // We mock the void method to do nothing, which is the default
        doNothing().when(patchStrategyContext).applyPatch(existingGarment, validPatchInstructions);

        // Mock the save operation to return the entity (assuming the context modified it)
        when(garmentRepository.save(existingGarment)).thenReturn(existingGarment);

        // Act
        CompleteGarmentResponse response = patchGarmentUseCase.execute(validGarmentId, validPatchInstructions);

        // Assert
        assertNotNull(response, "The response should not be null");
        assertEquals(validGarmentId, response.id(), "The returned ID should match the requested ID");

        // Verify orchestrator interactions
        verify(garmentRepository).findById(validGarmentId);
        verify(patchStrategyContext).applyPatch(existingGarment, validPatchInstructions);
        verify(garmentRepository).save(existingGarment);
    }

    @Test
    void execute_shouldThrowException_whenGarmentNotFound() {
        // Arrange
        when(garmentRepository.findById(validGarmentId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () ->
                patchGarmentUseCase.execute(validGarmentId, validPatchInstructions)
        );

        assertEquals(ErrorCode.GARMENT_NOT_FOUND, exception.getErrorCode());

        // Verify that if it fails early, it never tries to patch or save
        verify(patchStrategyContext, never()).applyPatch(any(), any());
        verify(garmentRepository, never()).save(any());
    }

    @Test
    void execute_shouldPropagateException_whenStrategyContextThrows() {
        // Arrange
        when(garmentRepository.findById(validGarmentId)).thenReturn(Optional.of(existingGarment));

        // Simulate a validation error from the patch context (e.g., bad status)
        AppException expectedValidationException = new AppException(ErrorCode.INVALID_GARMENT_STATUS);

        // Use doThrow for void methods in Mockito
        doThrow(expectedValidationException).when(patchStrategyContext).applyPatch(existingGarment, validPatchInstructions);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () ->
                patchGarmentUseCase.execute(validGarmentId, validPatchInstructions)
        );

        assertEquals(ErrorCode.INVALID_GARMENT_STATUS, exception.getErrorCode());

        // Verify that if patching fails, we never try to save corrupted data to the DB
        verify(garmentRepository).findById(validGarmentId);
        verify(garmentRepository, never()).save(any());
    }
}