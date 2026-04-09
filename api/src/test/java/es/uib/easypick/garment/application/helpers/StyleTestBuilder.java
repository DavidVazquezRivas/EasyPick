package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.StyleEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Test Data Builder for StyleEntity.
 * Centralizes the creation of valid Style instances for testing,
 * insulating tests from future changes in the entity's structure.
 */

public class StyleTestBuilder {

    private UUID id;
    private String name;
    private OffsetDateTime createdAt;

    private StyleTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Casual";
        this.createdAt = OffsetDateTime.now();
    }

    public static StyleTestBuilder aStyle() {
        return new StyleTestBuilder();
    }

    public StyleTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public StyleTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public StyleTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public StyleEntity build() {
        StyleEntity style = new StyleEntity();
        style.setId(this.id);
        style.setName(this.name);
        style.setCreatedAt(this.createdAt);
        return style;
    }
}
