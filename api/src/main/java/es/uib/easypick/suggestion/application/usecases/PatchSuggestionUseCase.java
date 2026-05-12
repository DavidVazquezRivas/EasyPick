package es.uib.easypick.suggestion.application.usecases;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.usecases.UseCase;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.patch.SuggestionPatchStrategyContext;
import es.uib.easypick.suggestion.infrastructure.repositories.SuggestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class PatchSuggestionUseCase {

    private final SuggestionRepository suggestionRepository;
    private final SuggestionPatchStrategyContext patchStrategyContext;

    @Transactional
    public SuggestionEntity execute(UUID suggestionId, Map<String, Object> patchInstructions) {
        SuggestionEntity suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new AppException(ErrorCode.SUGGESTION_NOT_FOUND));

        patchStrategyContext.applyPatch(suggestion, patchInstructions);

        return suggestionRepository.save(suggestion);
    }
}

