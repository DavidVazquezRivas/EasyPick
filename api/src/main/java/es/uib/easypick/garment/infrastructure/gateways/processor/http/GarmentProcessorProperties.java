package es.uib.easypick.garment.infrastructure.gateways.processor.http;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "application.modules.garment.processor")
public record GarmentProcessorProperties(
        String mode,
        String baseUrl,
        String processEndpoint
) {
}