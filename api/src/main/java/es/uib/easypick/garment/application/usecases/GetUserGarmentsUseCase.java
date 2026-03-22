package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.application.entities.GarmentStatus;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GetUserGarmentsUseCase {

    private final GarmentRepository repository;

    @Transactional(readOnly = true)
    public List<SimpleGarmentResponse> execute(UUID userId) {
        return repository.findByUserIdAndStatusOrderByUpdatedAtDesc(userId, GarmentStatus.CONFIRMED)
                .stream()
                .map(SimpleGarmentResponse::fromEntity)
                .toList();
    }
}
