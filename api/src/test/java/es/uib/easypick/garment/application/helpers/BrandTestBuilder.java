package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.BrandEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Test Data Builder for BrandEntity.
 * Centralizes the creation of valid Brand instances for testing,
 * insulating tests from future changes in the entity's structure.
 */

public class BrandTestBuilder {

    private UUID id;
    private String name;
    private OffsetDateTime createdAt;

    private BrandTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Nike";
        this.createdAt = OffsetDateTime.now();
    }

    public static BrandTestBuilder aBrand() {
        return new BrandTestBuilder();
    }

    public BrandTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public BrandTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public BrandTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public BrandEntity build() {
        BrandEntity brand = new BrandEntity();
        brand.setId(this.id);
        brand.setName(this.name);
        brand.setCreatedAt(this.createdAt);
        return brand;
    }


}
