package es.uib.easypick.suggestion.application.helpers;

import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponseOutfit;

import java.util.List;

public class SuggestionGatewayResponseTestBuilder {
    private List<SuggestionGatewayResponseOutfit> outfits;

    private SuggestionGatewayResponseTestBuilder() {
    }

    public static SuggestionGatewayResponseTestBuilder aSuggestionGatewayResponse() {
        return new SuggestionGatewayResponseTestBuilder();
    }

    public SuggestionGatewayResponseTestBuilder withOutfits(List<SuggestionGatewayResponseOutfit> outfits) {
        this.outfits = outfits;
        return this;
    }

    public SuggestionGatewayResponse build() {
        return new SuggestionGatewayResponse(outfits == null ? List.of() : outfits);
    }
}

