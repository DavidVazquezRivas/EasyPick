package es.uib.easypick.suggestion.infrastructure.gateways.suggestion;

import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;

public interface SuggestionGateway {
    SuggestionGatewayResponse getSuggestions(SuggestionContextRequest request);
}
