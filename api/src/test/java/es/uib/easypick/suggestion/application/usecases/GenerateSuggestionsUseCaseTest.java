package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.SuggestionGateway;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponseOutfit;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.application.helpers.UserTestBuilder;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GenerateSuggestionsUseCaseTest {

    @Test
    void execute_shouldPersistSuggestionsAndReturnDetailedResponses_whenNoPendingSuggestionsAndThrottleExpired() {
        GetSuggestionContextUseCase contextUseCase = mock(GetSuggestionContextUseCase.class);
        SuggestionGateway gateway = mock(SuggestionGateway.class);
        GarmentRepository garmentRepository = mock(GarmentRepository.class);
        SuggestionRepository suggestionRepository = mock(SuggestionRepository.class);
        UserRepository userRepository = mock(UserRepository.class);

        GenerateSuggestionsUseCase useCase = new GenerateSuggestionsUseCase(
                contextUseCase, gateway, garmentRepository, suggestionRepository, userRepository);

        UUID userId = UUID.randomUUID();
        LocationDto location = new LocationDto(1.0, 2.0);
        UserEntity user = UserTestBuilder.aUser().withId(userId).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(suggestionRepository.findPendingSuggestionsForUserSince(eq(userId), eq(SuggestionStatus.PENDING), any(OffsetDateTime.class)))
                .thenReturn(List.of());

        SuggestionEntity lastSuggestion = new SuggestionEntity();
        lastSuggestion.setGeneratedAt(OffsetDateTime.now().minusHours(11));
        when(suggestionRepository.findFirstByUserIdOrderByGeneratedAtDesc(userId)).thenReturn(Optional.of(lastSuggestion));

        SuggestionContextRequest ctx = new SuggestionContextRequest(List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), 1, location);
        when(contextUseCase.execute(userId, location)).thenReturn(ctx);

        UUID garmentId = UUID.randomUUID();
        SuggestionGatewayResponseOutfit outfit = new SuggestionGatewayResponseOutfit(List.of(garmentId));
        SuggestionGatewayResponse gatewayResponse = new SuggestionGatewayResponse(List.of(outfit));
        when(gateway.getSuggestions(ctx)).thenReturn(gatewayResponse);

        GarmentEntity garment = GarmentTestBuilder.aGarment().withId(garmentId).withName("Shirt").withPreferenceScore(5).build();
        when(garmentRepository.findWithDetailsById(garmentId)).thenReturn(Optional.of(garment));

        when(suggestionRepository.save(Mockito.any())).thenAnswer(invocation -> {
            SuggestionEntity s = invocation.getArgument(0);
            s.setId(UUID.randomUUID());
            return s;
        });

        var results = useCase.execute(userId, location);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(1, results.getFirst().garments().size());
        assertEquals(5, results.getFirst().garments().getFirst().score());

        verify(contextUseCase).execute(userId, location);
        verify(gateway).getSuggestions(ctx);
        verify(garmentRepository).findWithDetailsById(garmentId);
        verify(suggestionRepository).save(Mockito.any());
    }

    @Test
    void execute_shouldReturnPendingSuggestions_whenThereArePendingSuggestionsFromToday() {
        GetSuggestionContextUseCase contextUseCase = mock(GetSuggestionContextUseCase.class);
        SuggestionGateway gateway = mock(SuggestionGateway.class);
        GarmentRepository garmentRepository = mock(GarmentRepository.class);
        SuggestionRepository suggestionRepository = mock(SuggestionRepository.class);
        UserRepository userRepository = mock(UserRepository.class);

        GenerateSuggestionsUseCase useCase = new GenerateSuggestionsUseCase(
                contextUseCase, gateway, garmentRepository, suggestionRepository, userRepository);

        UUID userId = UUID.randomUUID();
        LocationDto location = new LocationDto(1.0, 2.0);
        UserEntity user = UserTestBuilder.aUser().withId(userId).build();
        GarmentEntity garment = GarmentTestBuilder.aGarment().withId(UUID.randomUUID()).withName("Pending Shirt").withPreferenceScore(3).build();

        SuggestionEntity pendingSuggestion = new SuggestionEntity();
        pendingSuggestion.setId(UUID.randomUUID());
        pendingSuggestion.setName("Suggestion 1");
        pendingSuggestion.setGeneratedAt(OffsetDateTime.now().minusHours(1));
        pendingSuggestion.setStatus(SuggestionStatus.PENDING);
        pendingSuggestion.setUser(user);
        pendingSuggestion.getGarmentSuggestions().add(new GarmentSuggestionEntity(pendingSuggestion, garment));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(suggestionRepository.findPendingSuggestionsForUserSince(eq(userId), eq(SuggestionStatus.PENDING), any(OffsetDateTime.class)))
                .thenReturn(List.of(pendingSuggestion));

        var results = useCase.execute(userId, location);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Suggestion 1", results.getFirst().name());
        assertEquals(1, results.getFirst().garments().size());
        assertEquals(3, results.getFirst().garments().getFirst().score());

        verify(contextUseCase, never()).execute(any(), any());
        verify(gateway, never()).getSuggestions(any());
        verify(suggestionRepository, never()).save(any());
    }

    @Test
    void execute_shouldReturnEmptyList_whenWithinThrottleWindowAndNoPendingSuggestions() {
        GetSuggestionContextUseCase contextUseCase = mock(GetSuggestionContextUseCase.class);
        SuggestionGateway gateway = mock(SuggestionGateway.class);
        GarmentRepository garmentRepository = mock(GarmentRepository.class);
        SuggestionRepository suggestionRepository = mock(SuggestionRepository.class);
        UserRepository userRepository = mock(UserRepository.class);

        GenerateSuggestionsUseCase useCase = new GenerateSuggestionsUseCase(
                contextUseCase, gateway, garmentRepository, suggestionRepository, userRepository);

        UUID userId = UUID.randomUUID();
        LocationDto location = new LocationDto(1.0, 2.0);
        UserEntity user = UserTestBuilder.aUser().withId(userId).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(suggestionRepository.findPendingSuggestionsForUserSince(eq(userId), eq(SuggestionStatus.PENDING), any(OffsetDateTime.class)))
                .thenReturn(List.of());

        SuggestionEntity lastSuggestion = new SuggestionEntity();
        lastSuggestion.setGeneratedAt(OffsetDateTime.now().minusHours(5));
        when(suggestionRepository.findFirstByUserIdOrderByGeneratedAtDesc(userId)).thenReturn(Optional.of(lastSuggestion));

        var results = useCase.execute(userId, location);

        assertNotNull(results);
        assertTrue(results.isEmpty());

        verify(contextUseCase, never()).execute(any(), any());
        verify(gateway, never()).getSuggestions(any());
        verify(suggestionRepository, never()).save(any());
    }

    @Test
    void execute_shouldAllowGeneration_whenLastGenerationWasMoreThanTenHoursAgo() {
        GetSuggestionContextUseCase contextUseCase = mock(GetSuggestionContextUseCase.class);
        SuggestionGateway gateway = mock(SuggestionGateway.class);
        GarmentRepository garmentRepository = mock(GarmentRepository.class);
        SuggestionRepository suggestionRepository = mock(SuggestionRepository.class);
        UserRepository userRepository = mock(UserRepository.class);

        GenerateSuggestionsUseCase useCase = new GenerateSuggestionsUseCase(
                contextUseCase, gateway, garmentRepository, suggestionRepository, userRepository);

        UUID userId = UUID.randomUUID();
        LocationDto location = new LocationDto(1.0, 2.0);
        UserEntity user = UserTestBuilder.aUser().withId(userId).build();

        SuggestionEntity lastSuggestion = new SuggestionEntity();
        lastSuggestion.setGeneratedAt(OffsetDateTime.now().minusHours(11));
        when(suggestionRepository.findPendingSuggestionsForUserSince(eq(userId), eq(SuggestionStatus.PENDING), any(OffsetDateTime.class)))
                .thenReturn(List.of());
        when(suggestionRepository.findFirstByUserIdOrderByGeneratedAtDesc(userId)).thenReturn(Optional.of(lastSuggestion));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        SuggestionContextRequest ctx = new SuggestionContextRequest(List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), 1, location);
        when(contextUseCase.execute(userId, location)).thenReturn(ctx);

        SuggestionGatewayResponse gatewayResponse = new SuggestionGatewayResponse(List.of());
        when(gateway.getSuggestions(ctx)).thenReturn(gatewayResponse);

        var results = useCase.execute(userId, location);

        assertNotNull(results);
        assertEquals(0, results.size());
    }
}

