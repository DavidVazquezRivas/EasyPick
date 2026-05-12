package es.uib.easypick.suggestion.application.helpers;

import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponseOutfit;

import java.util.List;
import java.util.UUID;

public class SuggestionGatewayResponseOutfitTestBuilder {
    private List<UUID> garmentIds;

    private SuggestionGatewayResponseOutfitTestBuilder() {
    }

    public static SuggestionGatewayResponseOutfitTestBuilder anOutfit() {
        return new SuggestionGatewayResponseOutfitTestBuilder();
    }

    public SuggestionGatewayResponseOutfitTestBuilder withGarmentIds(List<UUID> garmentIds) {
        this.garmentIds = garmentIds;
        return this;
    }

    public SuggestionGatewayResponseOutfit build() {
        return new SuggestionGatewayResponseOutfit(garmentIds == null ? List.of() : garmentIds);
    }
}

