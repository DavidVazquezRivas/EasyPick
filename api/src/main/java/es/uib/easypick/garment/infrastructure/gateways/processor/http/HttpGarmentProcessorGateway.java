package es.uib.easypick.garment.infrastructure.gateways.processor.http;

import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorGateway;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@ConditionalOnProperty(name = "application.modules.garment.processor.mode", havingValue = "http")
public class HttpGarmentProcessorGateway implements GarmentProcessorGateway {

    private final GarmentProcessorApiClient apiClient;

    public HttpGarmentProcessorGateway(GarmentProcessorApiClient apiClient) {
        this.apiClient = apiClient;
    }

    @Override
    public GarmentProcessorResponse processImage(MultipartFile file) {
        return apiClient.processImage(file);
    }
}