package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.application.patch.SuggestionPatchStrategyContext;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
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
class PatchSuggestionUseCaseTest {

    @Mock
    private SuggestionRepository suggestionRepository;

    @Mock
    private SuggestionPatchStrategyContext patchStrategyContext;

    @InjectMocks
    private PatchSuggestionUseCase patchSuggestionUseCase;

    private SuggestionEntity suggestion;
    private UUID suggestionId;
    private Map<String, Object> validStatusPatchInstructions;

    @BeforeEach
    void setUp() {
        suggestionId = UUID.randomUUID();
        suggestion = new SuggestionEntity();
        suggestion.setId(suggestionId);
        suggestion.setName("Test Suggestion");
        suggestion.setStatus(SuggestionStatus.PENDING);

        validStatusPatchInstructions = Map.of("status", "ACCEPTED");
    }

    @Test
    void execute_shouldSuccessfullyPatchAndReturnSuggestion_whenSuggestionExists() {
        // Arrange
        when(suggestionRepository.findById(suggestionId)).thenReturn(Optional.of(suggestion));
        when(suggestionRepository.save(suggestion)).thenReturn(suggestion);

        // Act
        SuggestionEntity result = patchSuggestionUseCase.execute(suggestionId, validStatusPatchInstructions);

        // Assert
        assertNotNull(result);
        assertEquals(suggestionId, result.getId());
        verify(suggestionRepository).findById(suggestionId);
        verify(patchStrategyContext).applyPatch(suggestion, validStatusPatchInstructions);
        verify(suggestionRepository).save(suggestion);
    }

    @Test
    void execute_shouldApplyRejectionPatchAndSaveSuggestion() {
        // Arrange
        when(suggestionRepository.findById(suggestionId)).thenReturn(Optional.of(suggestion));
        when(suggestionRepository.save(suggestion)).thenReturn(suggestion);

        Map<String, Object> patchInstructions = Map.of(
                "rejection", Map.of("customReason", "Not suitable")
        );

        // Act
        SuggestionEntity result = patchSuggestionUseCase.execute(suggestionId, patchInstructions);

        // Assert
        assertNotNull(result);
        assertEquals(suggestionId, result.getId());
        verify(patchStrategyContext).applyPatch(suggestion, patchInstructions);
        verify(suggestionRepository).save(suggestion);
    }

    @Test
    void execute_shouldThrowException_whenSuggestionNotFound() {
        // Arrange
        when(suggestionRepository.findById(suggestionId)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () ->
                patchSuggestionUseCase.execute(suggestionId, validStatusPatchInstructions)
        );

        assertEquals(ErrorCode.SUGGESTION_NOT_FOUND, exception.getErrorCode());
        verify(patchStrategyContext, never()).applyPatch(any(), any());
        verify(suggestionRepository, never()).save(any());
    }
}



