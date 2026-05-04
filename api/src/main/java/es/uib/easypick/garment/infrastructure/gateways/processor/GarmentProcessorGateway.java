package es.uib.easypick.garment.infrastructure.gateways.processor;

import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponse;
import org.springframework.web.multipart.MultipartFile;

public interface GarmentProcessorGateway {
    GarmentProcessorResponse processImage(MultipartFile file);
}
