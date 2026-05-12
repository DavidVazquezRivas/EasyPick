package es.uib.easypick.suggestion.application.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SuggestionEntityTest {

    private SuggestionEntity suggestion;

    @BeforeEach
    void setUp() {
        suggestion = new SuggestionEntity();
        suggestion.setName("Test Suggestion");
    }

    @Test
    void initialState_shouldBePendingAndNotFavorite() {
        assertEquals(SuggestionStatus.PENDING, suggestion.getStatus());
        assertFalse(suggestion.getIsFavorite());
    }

    @Test
    void accept_shouldSetStatusToAccepted() {
        suggestion.accept();
        assertEquals(SuggestionStatus.ACCEPTED, suggestion.getStatus());
    }

    @Test
    void toggleFavorite_shouldToggleIsFavoriteFlag() {
        assertFalse(suggestion.getIsFavorite());
        suggestion.toggleFavorite();
        assertTrue(suggestion.getIsFavorite());
        suggestion.toggleFavorite();
        assertFalse(suggestion.getIsFavorite());
    }

    @Test
    void reject_shouldSetStatusAndCreateRejection() {
        RejectionReasonEntity reason = new RejectionReasonEntity();
        reason.setName("Not suitable");

        suggestion.reject(reason, "too warm");

        assertEquals(SuggestionStatus.REJECTED, suggestion.getStatus());
        assertNotNull(suggestion.getRejection());
        assertEquals("too warm", suggestion.getRejection().getCustomReason());
        assertEquals(reason, suggestion.getRejection().getReason());
    }
}


