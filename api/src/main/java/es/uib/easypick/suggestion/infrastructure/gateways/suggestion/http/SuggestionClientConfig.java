package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.http;

import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.infrastructure.gateways.http.GlobalHttpErrorHandler;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
@EnableConfigurationProperties(SuggestionProperties.class)
public class SuggestionClientConfig {

    @Bean
    public SuggestionApiClient suggestionApiClient(
            RestClient.Builder builder,
            SuggestionProperties properties,
            GlobalHttpErrorHandler errorHandler) {

        RestClient restClient = builder
                .baseUrl(properties.baseUrl())
                .defaultStatusHandler(HttpStatusCode::isError,
                        (request, response) -> errorHandler.handle(response.getStatusCode(), response, ErrorCode.SUGGESTION_SERVICE_ERROR))
                .build();

        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        return factory.createClient(SuggestionApiClient.class);
    }
}
