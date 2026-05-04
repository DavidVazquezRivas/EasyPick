package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.suggestion.application.usecases.responses.RejectionReasonResponse;
import es.uib.easypick.suggestion.infrastructure.repositories.RejectionReasonRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@UseCase
@RequiredArgsConstructor
public class GetRejectionReasonsUseCase {

    private final RejectionReasonRepository rejectionReasonRepository;

    public List<RejectionReasonResponse> execute() {
        return rejectionReasonRepository.findAllByOrderByNameAsc().stream()
                .map(reason -> new RejectionReasonResponse(reason.getId(), reason.getName()))
                .toList();
    }
}
