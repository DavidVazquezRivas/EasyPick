package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.http;

import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;

public interface SuggestionApiClient {

    @PostExchange(contentType = MediaType.APPLICATION_JSON_VALUE)
    SuggestionGatewayResponse getSuggestions(@RequestBody SuggestionContextRequest request);
}

