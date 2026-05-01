package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.helpers.GarmentTestBuilder;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.SuggestionGateway;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponseOutfit;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class GenerateSuggestionsUseCaseTest {

    @Test
    void execute_shouldPersistSuggestionsAndReturnDetailedResponses() {
        GetSuggestionContextUseCase contextUseCase = mock(GetSuggestionContextUseCase.class);
        SuggestionGateway gateway = mock(SuggestionGateway.class);
        GarmentRepository garmentRepository = mock(GarmentRepository.class);
        SuggestionRepository suggestionRepository = mock(SuggestionRepository.class);

        GenerateSuggestionsUseCase useCase = new GenerateSuggestionsUseCase(contextUseCase, gateway, garmentRepository, suggestionRepository);

        UUID userId = UUID.randomUUID();
        LocationDto location = new LocationDto(1.0, 2.0);

        // prepare context
        SuggestionContextRequest ctx = new SuggestionContextRequest(List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), 1, location);
        when(contextUseCase.execute(userId, location)).thenReturn(ctx);

        UUID garmentId = UUID.randomUUID();
        SuggestionGatewayResponseOutfit outfit = new SuggestionGatewayResponseOutfit(List.of(garmentId));
        SuggestionGatewayResponse gatewayResponse = new SuggestionGatewayResponse(List.of(outfit));
        when(gateway.getSuggestions(ctx)).thenReturn(gatewayResponse);

        GarmentEntity garment = GarmentTestBuilder.aGarment().withId(garmentId).withName("Shirt").withPreferenceScore(5).build();
        when(garmentRepository.findWithDetailsById(garmentId)).thenReturn(Optional.of(garment));

        // stub save to return suggestion with id
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
}

