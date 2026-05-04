package es.uib.easypick.suggestion.application.helpers;

import es.uib.easypick.suggestion.application.entities.GarmentSuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionEntity;
import es.uib.easypick.suggestion.application.entities.SuggestionStatus;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class SuggestionTestBuilder {
    private UUID id;
    private String name;
    private Boolean isFavorite;
    private SuggestionStatus status;
    private OffsetDateTime createdAt;
    private Set<GarmentSuggestionEntity> garmentSuggestions;

    private SuggestionTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Default Suggestion";
        this.isFavorite = false;
        this.status = SuggestionStatus.PENDING;
        this.createdAt = OffsetDateTime.now();
        this.garmentSuggestions = new HashSet<>();
    }

    public static SuggestionTestBuilder aSuggestion() {
        return new SuggestionTestBuilder();
    }

    public SuggestionTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public SuggestionTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public SuggestionTestBuilder withIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
        return this;
    }

    public SuggestionTestBuilder withStatus(SuggestionStatus status) {
        this.status = status;
        return this;
    }

    public SuggestionTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public SuggestionTestBuilder withGarmentSuggestions(Set<GarmentSuggestionEntity> garmentSuggestions) {
        this.garmentSuggestions = garmentSuggestions;
        return this;
    }

    public SuggestionEntity build() {
        SuggestionEntity suggestion = new SuggestionEntity();
        suggestion.setId(this.id);
        suggestion.setName(this.name);
        suggestion.setIsFavorite(this.isFavorite);
        suggestion.setStatus(this.status);
        suggestion.setCreatedAt(this.createdAt);
        suggestion.setGarmentSuggestions(this.garmentSuggestions);
        return suggestion;
    }
}

