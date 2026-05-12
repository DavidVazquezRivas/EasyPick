package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;
import es.uib.easypick.suggestion.application.services.feedback.SuggestionFeedbackService;
import es.uib.easypick.user.application.entities.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SuggestionUpdateStatusCommand implements PatchCommand<SuggestionEntity> {

    private final SuggestionFeedbackService suggestionFeedbackService;

    @Override
    public String getFieldName() {
        return "status";
    }

    @Override
    public void execute(SuggestionEntity suggestion, Object newValue) {
        if (newValue == null) {
            throw new AppException(ErrorCode.INVALID_SUGGESTION_STATUS);
        }

        SuggestionStatus newStatus;
        try {
            newStatus = SuggestionStatus.valueOf(String.valueOf(newValue).toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_SUGGESTION_STATUS);
        }

        switch (newStatus) {
            case ACCEPTED:
                suggestion.accept();
                // Try to extract user id from garment suggestions and apply positive feedback
                UUID userId = extractUserId(suggestion);
                if (userId != null) {
                    suggestionFeedbackService.applyFeedback(userId, suggestion, 1, null, null);
                }
                break;
            case REJECTED:
                throw new AppException(ErrorCode.INVALID_SUGGESTION_STATUS,
                        "To reject a suggestion, use the rejection field with reasonId and/or customReason");
            case PENDING:
            default:
                throw new AppException(ErrorCode.INVALID_SUGGESTION_STATUS);
        }
    }

    private UUID extractUserId(SuggestionEntity suggestion) {
        return suggestion.getGarmentSuggestions().stream()
                .filter(Objects::nonNull)
                .map(GarmentSuggestionEntity::getGarment)
                .filter(Objects::nonNull)
                .map(GarmentEntity::getUser)
                .filter(Objects::nonNull)
                .map(UserEntity::getId)
                .findFirst()
                .orElse(null);
    }
}
