package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.core.infrastructure.gateways.storage.StorageGateway;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@UseCase
public class DeletePendingGarmentsUseCase {
    private final GarmentRepository garmentRepository;
    private final Duration pendingRetentionTime;
    private final StorageGateway storageGateway;

    public DeletePendingGarmentsUseCase(
            GarmentRepository garmentRepository,
            StorageGateway storageGateway,
            @Value("${application.modules.garment.cleaner.pending-retention-time}") Duration pendingRetentionTime) {
        this.garmentRepository = garmentRepository;
        this.storageGateway = storageGateway;
        this.pendingRetentionTime = pendingRetentionTime;
    }

    @Transactional
    public void execute() {
        OffsetDateTime thresholdTime = OffsetDateTime.now(ZoneOffset.UTC).minus(pendingRetentionTime);

        List<GarmentEntity> expiredGarments = garmentRepository
                .findByStatusAndCreatedAtBefore(GarmentStatus.PENDING, thresholdTime);

        if (!expiredGarments.isEmpty()) {
            List<String> urlsToDelete = expiredGarments.stream()
                    .map(GarmentEntity::getImageUrl)
                    .toList();

            storageGateway.deleteFilesBatch(urlsToDelete);

            // Logic delete() not repository physical delete
            expiredGarments.forEach(GarmentEntity::delete);
            garmentRepository.saveAll(expiredGarments);
        }
    }
}
