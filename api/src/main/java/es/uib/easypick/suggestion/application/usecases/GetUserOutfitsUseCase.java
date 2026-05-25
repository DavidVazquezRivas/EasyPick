package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.garment.presentation.dtos.responses.CompleteGarmentResponse;
import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import es.uib.easypick.suggestion.application.usecases.responses.GeneratedSuggestionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GetUserOutfitsUseCase {

    private final SuggestionRepository suggestionRepository;

    @Transactional(readOnly = true)
    public List<GeneratedSuggestionResponse> execute(UUID userId) {
        return suggestionRepository.findByUserIdOrderByGeneratedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    private GeneratedSuggestionResponse toResponse(SuggestionEntity suggestion) {
        List<CompleteGarmentResponse> garments = suggestion.getGarmentSuggestions().stream()
                .map(GarmentSuggestionEntity::getGarment)
                .map(CompleteGarmentResponse::fromEntity)
                .toList();

        return new GeneratedSuggestionResponse(
                suggestion.getId(),
                suggestion.getName(),
                garments,
                suggestion.getStatus().name(),
                Boolean.TRUE.equals(suggestion.getIsFavorite())
        );
    }
}