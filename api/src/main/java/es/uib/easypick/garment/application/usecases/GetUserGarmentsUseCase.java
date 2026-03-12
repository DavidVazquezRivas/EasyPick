package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.presentation.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
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
        return repository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(SimpleGarmentResponse::fromEntity)
                .toList();
    }
}
