package es.uib.easypick.garment.infrastructure.gateways.processor;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponse;
import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponseItem;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Component
@ConditionalOnProperty(
        name = {"application.modules.garment.processor.mode"},
        havingValue = "mock",
        matchIfMissing = true
)
public class MockGarmentProcessorGateway implements GarmentProcessorGateway {
    public GarmentProcessorResponse processImage(MultipartFile file) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            try {
                Thread.sleep(5000L);
            } catch (InterruptedException ignored) {
            }

            UUID EMPTY_UUID = new UUID(0L, 0L);

            GarmentProcessorResponseItem mockedResponse = GarmentProcessorResponseItem
                    .builder()
                    .brand(EMPTY_UUID)
                    .style(EMPTY_UUID)
                    .color(EMPTY_UUID)
                    .category(EMPTY_UUID)
                    .warmthIndex(0.0)
                    .imageBase64(base64Image)
                    .build();
            
            List<GarmentProcessorResponseItem> list = List.of(mockedResponse);
            return GarmentProcessorResponse.builder().garments(list).build();
        } catch (IOException var6) {
            throw new AppException(ErrorCode.UPLOAD_IMAGE_ERROR, "Failed to read image file for mock processing");
        }
    }
}
