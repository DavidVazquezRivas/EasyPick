package es.uib.easypick.garment.infrastructure.gateways.processor.http;

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
@EnableConfigurationProperties(GarmentProcessorProperties.class)
public class GarmentProcessorClientConfig {

    @Bean
    public GarmentProcessorApiClient garmentProcessorApiClient(
            RestClient.Builder builder,
            GarmentProcessorProperties properties,
            GlobalHttpErrorHandler errorHandler) {

        RestClient restClient = builder
                .baseUrl(properties.baseUrl())
                .defaultStatusHandler(HttpStatusCode::isError,
                        (request, response) -> errorHandler.handle(response.getStatusCode(), response, ErrorCode.UPLOAD_IMAGE_ERROR))
                .build();

        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        return factory.createClient(GarmentProcessorApiClient.class);
    }
}