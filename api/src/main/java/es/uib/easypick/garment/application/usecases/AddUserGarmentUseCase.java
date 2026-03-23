package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.core.infrastructure.gateways.storage.StorageGateway;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorGateway;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorResponse;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class AddUserGarmentUseCase {
    private final GarmentRepository garmentRepository;
    private final UserRepository userRepository;
    private final GarmentProcessorGateway garmentProcessorGateway;

    private final StorageGateway storageGateway;

    @Transactional
    public List<CompleteGarmentResponse> execute(UUID userId, MultipartFile file) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<GarmentProcessorResponse> processorResponses = garmentProcessorGateway.processImage(file);
        if (processorResponses.isEmpty()) throw new AppException(ErrorCode.NO_GARMENT_DETECTED);

        List<GarmentEntity> garmentsToSave = new ArrayList<>();

        for (GarmentProcessorResponse processorResponse : processorResponses) {
            byte[] decodedBytes = Base64.getDecoder().decode(processorResponse.imageBase64());
            String filename = "garment_" + UUID.randomUUID() + ".jpg";

            String imageUrl = storageGateway.uploadFile(decodedBytes, filename, "image/jpeg");

            // TODO: Use a proper mapping from processor response when more fields are added
            GarmentEntity garmentEntity = GarmentEntity.createPendingClassification(user, imageUrl);

            garmentsToSave.add(garmentEntity);
        }

        List<GarmentEntity> savedGarments = garmentRepository.saveAll(garmentsToSave);

        return savedGarments.stream().map(CompleteGarmentResponse::fromEntity).toList();
    }
}
