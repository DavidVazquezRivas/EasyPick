package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.BrandEntity;

import java.util.UUID;

/**
 * Test Data Builder for BrandEntity.
 */
public class BrandTestBuilder {

    private UUID id;
    private String name;

    private BrandTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Default Brand";
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

    public BrandEntity build() {
        BrandEntity brand = new BrandEntity();
        brand.setId(this.id);
        brand.setName(this.name);
        return brand;
    }
}