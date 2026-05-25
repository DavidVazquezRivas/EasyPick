package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SuggestionToggleFavoriteCommandTest {

    private SuggestionToggleFavoriteCommand command;
    private SuggestionEntity suggestion;

    @BeforeEach
    void setUp() {
        command = new SuggestionToggleFavoriteCommand();
        suggestion = new SuggestionEntity();
        suggestion.setIsFavorite(false);
    }

    @Test
    void shouldReturnCorrectFieldName() {
        assertEquals("isFavorite", command.getFieldName());
    }

    @Test
    void shouldToggleFavoriteOnWhenDesiredValueIsTrue() {
        command.execute(suggestion, true);

        assertEquals(true, suggestion.getIsFavorite());
    }

    @Test
    void shouldToggleFavoriteOffWhenDesiredValueIsFalse() {
        suggestion.setIsFavorite(true);

        command.execute(suggestion, false);

        assertEquals(false, suggestion.getIsFavorite());
    }

    @Test
    void shouldThrowExceptionWhenValueIsInvalid() {
        AppException exception = assertThrows(AppException.class, () -> command.execute(suggestion, 123));

        assertEquals(ErrorCode.INVALID_SUGGESTION_STATUS, exception.getErrorCode());
    }
}