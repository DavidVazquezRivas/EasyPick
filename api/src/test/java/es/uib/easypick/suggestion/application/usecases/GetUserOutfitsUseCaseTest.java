package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetUserOutfitsUseCaseTest {

    @Mock
    private SuggestionRepository suggestionRepository;

    @InjectMocks
    private GetUserOutfitsUseCase useCase;

    private UUID userId;
    private SuggestionEntity suggestion;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        suggestion = new SuggestionEntity();
        suggestion.setId(UUID.randomUUID());
        suggestion.setName("Saved outfit");
        suggestion.setStatus(SuggestionStatus.ACCEPTED);
        suggestion.setIsFavorite(true);

        GarmentEntity garment = new GarmentEntity();
        garment.setId(UUID.randomUUID());
        garment.setName("T-shirt");
        garment.setImageUrl("https://example.com/tshirt.png");

        suggestion.setGarmentSuggestions(
                java.util.Set.of(new GarmentSuggestionEntity(suggestion, garment))
        );
    }

    @Test
    void shouldReturnMappedOutfitsForUser() {
        when(suggestionRepository.findByUserIdOrderByGeneratedAtDesc(userId)).thenReturn(List.of(suggestion));

        var result = useCase.execute(userId);

        assertEquals(1, result.size());
        assertEquals(suggestion.getId(), result.getFirst().id());
        assertEquals("Saved outfit", result.getFirst().name());
        assertEquals("ACCEPTED", result.getFirst().status());
        assertTrue(result.getFirst().isFavorite());
        assertEquals(1, result.getFirst().garments().size());
        assertFalse(result.getFirst().garments().getFirst().name().isBlank());
    }
}