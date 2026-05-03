package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.application.services.feedback.SuggestionFeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SuggestionUpdateStatusCommandTest {

    @Mock
    private SuggestionFeedbackService feedbackService;

    @InjectMocks
    private SuggestionUpdateStatusCommand command;

    private SuggestionEntity suggestion;

    @BeforeEach
    void setUp() {
        suggestion = new SuggestionEntity();
        suggestion.setName("Test Suggestion");
        suggestion.setStatus(SuggestionStatus.PENDING);
    }

    @Test
    void shouldReturnCorrectFieldName() {
        // Assert
        assertEquals("status", command.getFieldName());
    }

    @Test
    void shouldAcceptSuggestion_whenStatusIsAccepted() {
        // Act
        command.execute(suggestion, "ACCEPTED");

        // Assert
        assertEquals(SuggestionStatus.ACCEPTED, suggestion.getStatus());
    }

    @Test
    void shouldThrowException_whenStatusIsRejected() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(suggestion, "REJECTED"));

        assertEquals(ErrorCode.INVALID_SUGGESTION_STATUS, exception.getErrorCode());
    }

    @Test
    void shouldThrowException_whenStatusIsInvalid() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(suggestion, "INVALID"));

        assertEquals(ErrorCode.INVALID_SUGGESTION_STATUS, exception.getErrorCode());
    }

    @Test
    void shouldThrowException_whenStatusIsNull() {
        // Act & Assert
        AppException exception = assertThrows(AppException.class,
                () -> command.execute(suggestion, null));

        assertEquals(ErrorCode.INVALID_SUGGESTION_STATUS, exception.getErrorCode());
    }
}


