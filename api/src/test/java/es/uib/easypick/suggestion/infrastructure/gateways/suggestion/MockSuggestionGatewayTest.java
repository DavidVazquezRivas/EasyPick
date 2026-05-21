package es.uib.easypick.suggestion.infrastructure.gateways.suggestion;

import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.LocationDto;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class MockSuggestionGatewayTest {

    @Test
    void mockGateway_shouldReturnRequestedNumberOfOutfits() {
        MockSuggestionGateway gateway = new MockSuggestionGateway();

        CompleteGarmentResponse g = CompleteGarmentResponse.builder()
                .id(UUID.randomUUID())
                .name("Shirt")
                .description("")
                .imageUrl("")
                .createdAt(null)
                .updatedAt(null)
                .brand(null)
                .style(null)
                .category(null)
                .colors(Set.of())
                .score(5)
                .build();

        SuggestionContextRequest ctx = new SuggestionContextRequest(List.of(), List.of(), List.of(), List.of(), List.of(g), List.of(), 2, new LocationDto(0.0,0.0));

        SuggestionGatewayResponse resp = gateway.getSuggestions(ctx);

        assertNotNull(resp);
        assertEquals(2, resp.outfits().size());
    }
}


