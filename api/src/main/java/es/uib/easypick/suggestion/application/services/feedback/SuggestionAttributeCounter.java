package es.uib.easypick.suggestion.application.services.feedback;

import es.uib.easypick.core.application.entities.BaseEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class SuggestionAttributeCounter {

    public static PreferenceUniqueAttributes extractUniqueAttributes(SuggestionEntity suggestion) {
        Set<UUID> garmentIds = new HashSet<>();
        Set<UUID> colorIds = new HashSet<>();
        Set<UUID> brandIds = new HashSet<>();
        Set<UUID> styleIds = new HashSet<>();
        Set<UUID> categoryIds = new HashSet<>();

        suggestion.getGarmentSuggestions().forEach(gs -> {
            GarmentEntity garment = gs.getGarment();
            garmentIds.add(garment.getId());
            colorIds.addAll(garment.getColors().stream().map(BaseEntity::getId).toList());
            
            if (garment.getBrand() != null) {
                brandIds.add(garment.getBrand().getId());
            }
            if (garment.getStyle() != null) {
                styleIds.add(garment.getStyle().getId());
            }
            if (garment.getCategory() != null) {
                categoryIds.add(garment.getCategory().getId());
            }
        });

        return new PreferenceUniqueAttributes(garmentIds, colorIds, brandIds, styleIds, categoryIds);
    }
}
