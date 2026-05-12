package es.uib.easypick.suggestion.application.services.feedback;

import java.util.UUID;

public interface UserPreferenceUpdater {
    void upsertColorPreference(UUID userId, UUID colorId, int delta);

    void upsertBrandPreference(UUID userId, UUID brandId, int delta);

    void upsertStylePreference(UUID userId, UUID styleId, int delta);

    void upsertCategoryPreference(UUID userId, UUID categoryId, int delta);
}
