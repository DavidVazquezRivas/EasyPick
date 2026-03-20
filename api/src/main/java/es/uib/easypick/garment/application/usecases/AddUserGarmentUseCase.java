package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.core.infrastructure.gateway.storage.StorageGateway;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.user.application.entities.UserEntity;
import es.uib.easypick.user.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class AddUserGarmentUseCase {
    private final GarmentRepository garmentRepository;
    private final UserRepository userRepository;

    private final StorageGateway storageGateway;

    @Transactional
    public SimpleGarmentResponse execute(UUID userId, MultipartFile file) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String imageUrl = storageGateway.uploadImage(file);

        GarmentEntity garment = GarmentEntity.createPendingClassification(user, imageUrl);

        // TODO: Call AI model to classify garment and add details to garment entity before saving

        GarmentEntity savedGarment = garmentRepository.save(garment);

        return SimpleGarmentResponse.fromEntity(savedGarment);
    }
}
