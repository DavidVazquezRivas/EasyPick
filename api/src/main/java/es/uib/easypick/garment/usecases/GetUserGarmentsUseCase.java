package es.uib.easypick.garment.usecases;

import es.uib.easypick.core.usecases.UseCase;
import es.uib.easypick.garment.dtos.responses.SimpleGarmentResponse;
import es.uib.easypick.garment.repositories.GarmentRepository;
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
