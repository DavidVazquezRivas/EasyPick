package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.StyleEntity;

import java.util.UUID;

/**
 * Test Data Builder for StyleEntity.
 */
public class StyleTestBuilder {

    private UUID id;
    private String name;

    private StyleTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Default Style";
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

    public StyleEntity build() {
        StyleEntity style = new StyleEntity();
        style.setId(this.id);
        style.setName(this.name);
        return style;
    }
}