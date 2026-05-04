package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.suggestion.application.entities.RejectionReasonEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.infrastructure.repositories.RejectionReasonRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SuggestionHandleRejectionCommandTest {

    @Mock
    private RejectionReasonRepository rejectionReasonRepository;

    @Mock
    private es.uib.easypick.suggestion.application.services.feedback.SuggestionFeedbackService suggestionFeedbackService;

    @InjectMocks
    private SuggestionHandleRejectionCommand command;

    private SuggestionEntity suggestion;
    private RejectionReasonEntity reason;

    @BeforeEach
    void setUp() {
        suggestion = new SuggestionEntity();
        suggestion.setName("Test Suggestion");
        suggestion.setStatus(SuggestionStatus.PENDING);

        reason = new RejectionReasonEntity();
        reason.setId(UUID.randomUUID());
        reason.setName("No me convence");
    }

    @Test
    void shouldReturnCorrectFieldName() {
        // Assert
        assertEquals("rejection", command.getFieldName());
    }

    @Test
    void shouldRejectSuggestion_whenReasonIdIsValid() {
        // Arrange
        when(rejectionReasonRepository.findById(reason.getId())).thenReturn(Optional.of(reason));

        Map<String, Object> rejectionData = Map.of("reasonId", reason.getId().toString());

        // Act
        command.execute(suggestion, rejectionData);

        // Assert
        assertEquals(SuggestionStatus.REJECTED, suggestion.getStatus());
        assertNotNull(suggestion.getRejection());
        assertEquals(reason, suggestion.getRejection().getReason());
        assertNull(suggestion.getRejection().getCustomReason());
    }

    @Test
    void shouldRejectSuggestion_whenOnlyCustomReasonIsProvided() {
        // Arrange
        Map<String, Object> rejectionData = Map.of("customReason", "Not suitable for today");

        // Act
        command.execute(suggestion, rejectionData);

        // Assert
        assertEquals(SuggestionStatus.REJECTED, suggestion.getStatus());
        assertNotNull(suggestion.getRejection());
        assertNull(suggestion.getRejection().getReason());
        assertEquals("Not suitable for today", suggestion.getRejection().getCustomReason());
    }

    @Test
    void shouldRejectSuggestion_whenReasonIdAndCustomReasonAreProvided() {
        // Arrange
        when(rejectionReasonRepository.findById(reason.getId())).thenReturn(Optional.of(reason));

        Map<String, Object> rejectionData = Map.of(
                "reasonId", reason.getId().toString(),
                "customReason", "Additional info"
        );

        // Act
        command.execute(suggestion, rejectionData);

        // Assert
        assertEquals(SuggestionStatus.REJECTED, suggestion.getStatus());
        assertNotNull(suggestion.getRejection());
        assertEquals(reason, suggestion.getRejection().getReason());
        assertEquals("Additional info", suggestion.getRejection().getCustomReason());
    }

    @Test
    void shouldThrowException_whenReasonIdDoesNotExist() {
        // Arrange
        Map<String, Object> rejectionData = Map.of("reasonId", UUID.randomUUID().toString());

        when(rejectionReasonRepository.findById(any())).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(suggestion, rejectionData));

        assertEquals(ErrorCode.REJECTION_REASON_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void shouldThrowException_whenRejectionPayloadIsNotAMap() {
        // Act
        command.execute(suggestion, "invalid");

        // Assert: non-map payload should result in a rejection with no reason
        assertEquals(SuggestionStatus.REJECTED, suggestion.getStatus());
        assertNotNull(suggestion.getRejection());
        assertNull(suggestion.getRejection().getReason());
        assertNull(suggestion.getRejection().getCustomReason());
    }

    @Test
    void shouldThrowException_whenReasonIdHasInvalidFormat() {
        // Arrange
        Map<String, Object> rejectionData = Map.of("reasonId", "not-a-uuid");

        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(suggestion, rejectionData));

        assertEquals(ErrorCode.INVALID_UUID_FORMAT, exception.getErrorCode());
    }
}


