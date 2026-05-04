package es.uib.easypick.suggestion.application.services.feedback;

import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.garment.infrastructure.repositories.GarmentRepository;
import es.uib.easypick.suggestion.application.entities.RejectionReasonEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SuggestionFeedbackService {

    private final UserPreferenceUpdater userPreferenceUpdater;
    private final GarmentRepository garmentRepository;

    public void applyFeedback(UUID userId, SuggestionEntity suggestion, int delta,
                              @Nullable RejectionReasonEntity reason,
                              @Nullable String customReason) {
        PreferenceUniqueAttributes uniqueAttributes = SuggestionAttributeCounter.extractUniqueAttributes(suggestion);

        // Update garment scores
        for (UUID garmentId : uniqueAttributes.garmentIds()) {
            GarmentEntity garment = garmentRepository.findWithDetailsById(garmentId)
                    .orElseThrow();

            garment.setPreferenceScore(garment.getPreferenceScore() + delta);
            garmentRepository.save(garment);
        }

        // Update attributes scores
        uniqueAttributes.uniqueColorIds().forEach(colorId ->
                userPreferenceUpdater.upsertColorPreference(userId, colorId, delta));

        uniqueAttributes.uniqueBrandsIds().forEach(brandId ->
                userPreferenceUpdater.upsertBrandPreference(userId, brandId, delta));

        uniqueAttributes.uniqueStyleIds().forEach(styleId ->
                userPreferenceUpdater.upsertStylePreference(userId, styleId, delta));

        uniqueAttributes.uniqueCategoryIds().forEach(categoryId ->
                userPreferenceUpdater.upsertCategoryPreference(userId, categoryId, delta));
    }
}
