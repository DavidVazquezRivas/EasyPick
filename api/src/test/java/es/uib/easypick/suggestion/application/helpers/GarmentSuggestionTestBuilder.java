package es.uib.easypick.suggestion.application.helpers;

import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import java.util.UUID;

public class GarmentSuggestionTestBuilder {
    private UUID id;
    private SuggestionEntity suggestion;
    private GarmentEntity garment;

    private GarmentSuggestionTestBuilder() {
        this.id = UUID.randomUUID();
        this.suggestion = null;
        this.garment = null;
    }

    public static GarmentSuggestionTestBuilder aGarmentSuggestion() {
        return new GarmentSuggestionTestBuilder();
    }

    public GarmentSuggestionTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public GarmentSuggestionTestBuilder withSuggestion(SuggestionEntity suggestion) {
        this.suggestion = suggestion;
        return this;
    }

    public GarmentSuggestionTestBuilder withGarment(GarmentEntity garment) {
        this.garment = garment;
        return this;
    }

    public GarmentSuggestionEntity build() {
        GarmentSuggestionEntity gs = new GarmentSuggestionEntity();
        gs.setId(this.id);
        gs.setSuggestion(this.suggestion);
        gs.setGarment(this.garment);
        return gs;
    }
}

