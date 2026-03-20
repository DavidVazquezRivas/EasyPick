package es.uib.easypick.garment.infrastructure.gateways.processor;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Component
@ConditionalOnProperty(name = "application.modules.gateway.processor.mode", havingValue = "mock", matchIfMissing = true)
public class MockGarmentProcessorGateway implements GarmentProcessorGateway {
    @Override
    public List<GarmentProcessorResponse> processImage(MultipartFile file) {
        try {
            String base64Image = java.util.Base64.getEncoder().encodeToString(file.getBytes());

            GarmentProcessorResponse mockedResponse1 = new GarmentProcessorResponse(base64Image);
            GarmentProcessorResponse mockedResponse2 = new GarmentProcessorResponse(base64Image);

            return List.of(mockedResponse1, mockedResponse2);
        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR, "Failed to read image file for mock processing");
        }
    }
}
