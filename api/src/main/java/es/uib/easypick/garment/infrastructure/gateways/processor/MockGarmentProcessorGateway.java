package es.uib.easypick.garment.infrastructure.gateways.processor;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Component
@ConditionalOnProperty(
        name = {"application.modules.garment.processor.mode"},
        havingValue = "mock",
        matchIfMissing = true
)
public class MockGarmentProcessorGateway implements GarmentProcessorGateway {
    public List<GarmentProcessorResponse> processImage(MultipartFile file) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            try {
                Thread.sleep(5000L);
            } catch (InterruptedException var5) {
            }

            GarmentProcessorResponse mockedResponse1 = new GarmentProcessorResponse(base64Image);
            GarmentProcessorResponse mockedResponse2 = new GarmentProcessorResponse(base64Image);
            return List.of(mockedResponse1, mockedResponse2);
        } catch (IOException var6) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR, "Failed to read image file for mock processing");
        }
    }
}
