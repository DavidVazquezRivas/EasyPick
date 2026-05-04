package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GetGarmentByIdUseCase {

    private final GarmentRepository repository;

    @Transactional(readOnly = true)
    public CompleteGarmentResponse execute(UUID garmentId) {
        return repository.findWithDetailsById(garmentId)
                .map(CompleteGarmentResponse::fromEntity)
                .orElseThrow(() -> new AppException(ErrorCode.GARMENT_NOT_FOUND));
    }
}