package es.uib.easypick.suggestion.infrastructure.gateways.suggestion.http;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "application.modules.suggestion")
public record SuggestionProperties(
        String mode,
        String baseUrl,
        String processEndpoint
) {
}
