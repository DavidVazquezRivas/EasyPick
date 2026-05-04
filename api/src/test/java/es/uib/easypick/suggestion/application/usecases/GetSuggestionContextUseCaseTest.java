package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.application.helpers.GarmentSuggestionTestBuilder;
import es.uib.easypick.suggestion.application.helpers.SuggestionTestBuilder;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import es.uib.easypick.user.application.entities.*;
import es.uib.easypick.user.application.helpers.UserTestBuilder;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetSuggestionContextUseCaseTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private GarmentRepository garmentRepository;
    @Mock
    private SuggestionRepository suggestionRepository;

    @InjectMocks
    private GetSuggestionContextUseCase useCase;

    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(useCase, "requestedOutfitCount", 2);
    }

    @Test
    void shouldReturnSuggestionContextRequestWithAllData() {
        UserEntity user = UserTestBuilder.aUser().withId(userId).build();

        UserColorPreferenceEntity colorPref = new UserColorPreferenceEntity();
        colorPref.setColor(new es.uib.easypick.garment.application.entities.ColorEntity());
        colorPref.getColor().setId(UUID.randomUUID());
        colorPref.setScore(5);
        user.setColorPreferences(Set.of(colorPref));

        UserBrandPreferenceEntity brandPref = new UserBrandPreferenceEntity();
        brandPref.setBrand(new es.uib.easypick.garment.application.entities.BrandEntity());
        brandPref.getBrand().setId(UUID.randomUUID());
        brandPref.setScore(3);
        user.setBrandPreferences(Set.of(brandPref));

        UserCategoryPreferenceEntity categoryPref = new UserCategoryPreferenceEntity();
        categoryPref.setCategory(new es.uib.easypick.garment.application.entities.CategoryEntity());
        categoryPref.getCategory().setId(UUID.randomUUID());
        categoryPref.setScore(2);
        user.setCategoryPreferences(Set.of(categoryPref));

        UserStylePreferenceEntity stylePref = new UserStylePreferenceEntity();
        stylePref.setStyle(new es.uib.easypick.garment.application.entities.StyleEntity());
        stylePref.getStyle().setId(UUID.randomUUID());
        stylePref.setScore(4);
        user.setStylePreferences(Set.of(stylePref));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));


        GarmentEntity garmentEntity = GarmentTestBuilder.aGarment()
                .withId(UUID.randomUUID())
                .withName("Shirt")
                .withPreferenceScore(7)
                .withStatus(GarmentStatus.CONFIRMED)
                .build();
        when(garmentRepository.findWithDetailsByUserIdAndStatusOrderByUpdatedAtDesc(userId, GarmentStatus.CONFIRMED))
                .thenReturn(List.of(garmentEntity));

        var gs = GarmentSuggestionTestBuilder.aGarmentSuggestion()
                .withGarment(garmentEntity)
                .build();

        var suggestion = SuggestionTestBuilder.aSuggestion()
                .withId(UUID.randomUUID())
                .withName("Outfit 1")
                .withIsFavorite(true)
                .withStatus(SuggestionStatus.ACCEPTED)
                .withCreatedAt(OffsetDateTime.now())
                .withGarmentSuggestions(Set.of(gs))
                .build();
        when(suggestionRepository.findByUserId(userId)).thenReturn(List.of(suggestion));

        LocationDto location = new LocationDto(39.5696, 2.6502);
        SuggestionContextRequest result = useCase.execute(userId, location);
        assertNotNull(result);
        assertEquals(1, result.garments().size());
        assertEquals(1, result.previousSuggestions().size());
        assertEquals(2, result.requestedOutfitCount());
        assertEquals(1, result.colorPreferences().size());
        assertEquals(1, result.brandPreferences().size());
        assertEquals(1, result.categoryPreferences().size());
        assertEquals(1, result.stylePreferences().size());
        assertEquals(7, result.garments().get(0).score());
        assertNotNull(result.location());
        assertEquals(39.5696, result.location().lat(), 0.0001);
        assertEquals(2.6502, result.location().lng(), 0.0001);
        verify(userRepository).findById(userId);
        verify(garmentRepository).findWithDetailsByUserIdAndStatusOrderByUpdatedAtDesc(userId, GarmentStatus.CONFIRMED);
        verify(suggestionRepository).findByUserId(userId);
    }

    @Test
    void shouldThrowIfUserNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        LocationDto location = new LocationDto(0.0, 0.0);
        assertThrows(AppException.class, () -> useCase.execute(userId, location));
        verify(userRepository).findById(userId);
        verifyNoMoreInteractions(garmentRepository, suggestionRepository);
    }
}



