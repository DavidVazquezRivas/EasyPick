package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.ColorEntity;
import es.uib.easypick.garment.application.entities.GarmentEntity;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Test Data Builder for ColorEntity.
 * Centralizes the creation of valid Color instances for testing,
 * insulating tests from future changes in the entity's structure.
 */
public class ColorTestBuilder {

    private UUID id;
    private String name;
    private String hexCode;
    private OffsetDateTime createdAt;
    private Set<GarmentEntity> garments;

    private ColorTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Navy Blue";
        this.hexCode = "#000080";
        this.createdAt = OffsetDateTime.now();
        this.garments = new HashSet<>();
    }

    public static ColorTestBuilder aColor() {
        return new ColorTestBuilder();
    }

    public ColorTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public ColorTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public ColorTestBuilder withHexCode(String hexCode) {
        this.hexCode = hexCode;
        return this;
    }

    public ColorTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public ColorTestBuilder withGarments(Set<GarmentEntity> garments) {
        this.garments = garments;
        return this;
    }

    public ColorEntity build() {
        ColorEntity color = new ColorEntity();
        color.setId(this.id);
        color.setName(this.name);
        color.setHexCode(this.hexCode);
        color.setCreatedAt(this.createdAt);
        color.setGarments(this.garments);
        return color;
    }
}