package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.RejectionReasonEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.services.feedback.SuggestionFeedbackService;
import es.uib.easypick.suggestion.infrastructure.repositories.RejectionReasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SuggestionHandleRejectionCommand implements PatchCommand<SuggestionEntity> {

    private final RejectionReasonRepository rejectionReasonRepository;
    private final SuggestionFeedbackService suggestionFeedbackService;

    @Override
    public String getFieldName() {
        return "rejection";
    }

    @Override
    public void execute(SuggestionEntity suggestion, Object value) {
        if (!(value instanceof Map)) {
            suggestion.reject(null, null);
            return;
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> rejectionData = (Map<String, Object>) value;

        RejectionReasonEntity reason = null;
        String customReason = null;

        if (rejectionData.containsKey("reasonId")) {
            Object reasonId = rejectionData.get("reasonId");
            if (reasonId != null) {
                try {
                    UUID reasonUuid = UUID.fromString(String.valueOf(reasonId));
                    reason = rejectionReasonRepository.findById(reasonUuid)
                            .orElseThrow(() -> new AppException(ErrorCode.REJECTION_REASON_NOT_FOUND));
                } catch (IllegalArgumentException e) {
                    throw new AppException(ErrorCode.INVALID_UUID_FORMAT);
                }
            }
        }

        if (rejectionData.containsKey("customReason")) {
            customReason = (String) rejectionData.get("customReason");
        }

        suggestion.reject(reason, customReason);

        try {
            UUID userId = extractUserId(suggestion);
            if (userId != null) {
                suggestionFeedbackService.applyFeedback(userId, suggestion, -1, reason, customReason);
            }
        } catch (Exception ex) {
            // Do not block rejection flow if feedback application fails
        }
    }

    private UUID extractUserId(SuggestionEntity suggestion) {
        return suggestion.getGarmentSuggestions().stream()
                .map(GarmentSuggestionEntity::getGarment)
                .filter(Objects::nonNull)
                .map(GarmentEntity::getUser)
                .filter(java.util.Objects::nonNull)
                .map(BaseEntity::getId)
                .findFirst()
                .orElse(null);
    }
}


