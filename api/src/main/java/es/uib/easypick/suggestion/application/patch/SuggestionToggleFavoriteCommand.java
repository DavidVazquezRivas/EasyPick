package es.uib.easypick.suggestion.application.patch;

import es.uib.easypick.core.application.exceptions.AppException;
import es.uib.easypick.core.application.exceptions.ErrorCode;
import es.uib.easypick.core.application.patch.PatchCommand;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import org.springframework.stereotype.Component;

@Component
public class SuggestionToggleFavoriteCommand implements PatchCommand<SuggestionEntity> {

    @Override
    public String getFieldName() {
        return "isFavorite";
    }

    @Override
    public void execute(SuggestionEntity suggestion, Object newValue) {
        boolean desiredFavorite;

        if (newValue instanceof Boolean booleanValue) {
            desiredFavorite = booleanValue;
        } else if (newValue instanceof String stringValue) {
            if (!"true".equalsIgnoreCase(stringValue) && !"false".equalsIgnoreCase(stringValue)) {
                throw new AppException(ErrorCode.INVALID_SUGGESTION_STATUS);
            }

            desiredFavorite = Boolean.parseBoolean(stringValue);
        } else {
            throw new AppException(ErrorCode.INVALID_SUGGESTION_STATUS);
        }

        boolean currentFavorite = Boolean.TRUE.equals(suggestion.getIsFavorite());
        if (currentFavorite != desiredFavorite) {
            suggestion.toggleFavorite();
        }
    }
}