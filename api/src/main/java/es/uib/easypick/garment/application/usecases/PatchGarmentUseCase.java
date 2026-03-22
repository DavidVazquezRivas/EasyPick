package es.uib.easypick.garment.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.application.patch.GarmentPatchStrategyContext;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class PatchGarmentUseCase {
    private final GarmentRepository garmentRepository;
    private final GarmentPatchStrategyContext patchStrategyContext;

    public CompleteGarmentResponse execute(UUID garmentId, Map<String, Object> patchInstructions) {
        GarmentEntity garment = garmentRepository.findById(garmentId)
                .orElseThrow(() -> new AppException(ErrorCode.GARMENT_NOT_FOUND));

        patchStrategyContext.applyPatch(garment, patchInstructions);

        return CompleteGarmentResponse.fromEntity(garmentRepository.save(garment));
    }
}
