package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.http;

import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.SuggestionGateway;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.requests.SuggestionContextRequest;
import es.uib.easypick.suggestion.infrastructure.gateways.suggestion.responses.SuggestionGatewayResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "application.modules.suggestion.mode", havingValue = "http")
@RequiredArgsConstructor
public class HttpSuggestionGateway implements SuggestionGateway {

    private final SuggestionApiClient apiClient;


    @Override
    public SuggestionGatewayResponse getSuggestions(SuggestionContextRequest request) {
        return apiClient.getSuggestions(request);
    }
}

