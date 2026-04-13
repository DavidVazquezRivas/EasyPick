package es.uib.easypick.garment.infrastructure.gateways.processor;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface GarmentProcessorGateway {
    List<GarmentProcessorResponse> processImage(MultipartFile file);
}
