package es.uib.easypick.garment.infrastructure.gateways.processor.http;

import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.PostExchange;

public interface GarmentProcessorApiClient {

    @PostExchange(contentType = MediaType.MULTIPART_FORM_DATA_VALUE)
    GarmentProcessorResponse processImage(@RequestPart("image") MultipartFile file);
}