package es.uib.easypick.suggestion.infrastructure.gateways.suggestion;

import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponseOutfit;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConditionalOnProperty(name = "application.modules.suggestion.mode", havingValue = "mock", matchIfMissing = true)
public class MockSuggestionGateway implements SuggestionGateway {

    @Override
    public SuggestionGatewayResponse getSuggestions(SuggestionContextRequest request) {
        List<SuggestionGatewayResponseOutfit> outfits = new ArrayList<>();
        int count = request.requestedOutfitCount() == null ? 1 : request.requestedOutfitCount();

        var garments = request.garments();
        if (garments == null || garments.isEmpty()) {
            for (int i = 0; i < count; i++) {
                outfits.add(new SuggestionGatewayResponseOutfit(List.of()));
            }
            return new SuggestionGatewayResponse(outfits);
        }

        for (int i = 0; i < count; i++) {
            List<java.util.UUID> garmentIds = new ArrayList<>();
            for (int j = 0; j < 3 && garmentIds.size() < garments.size(); j++) {
                int idx = (i + j) % garments.size();
                garmentIds.add(garments.get(idx).id());
            }
            outfits.add(new SuggestionGatewayResponseOutfit(garmentIds));
        }

        return new SuggestionGatewayResponse(outfits);
    }
}


