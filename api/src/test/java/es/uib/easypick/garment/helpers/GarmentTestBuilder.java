package es.uib.easypick.garment.helpers;

import es.uib.easypick.garment.entities.GarmentEntity;
import es.uib.easypick.user.entities.UserEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Test Data Builder for GarmentEntity.
 * Generates valid instances with default dummy data to avoid test fragility.
 */
public class GarmentTestBuilder {

    private UUID id;
    private String name;
    private String description;
    private String imageUrl;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private UserEntity user;

    private GarmentTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Default T-Shirt";
        this.description = "Default T-Shirt long description to ensure we meet any length requirements.";
        this.imageUrl = "https://example.com/default-tshirt.jpg";
        this.createdAt = OffsetDateTime.now().minusDays(1);
        this.updatedAt = OffsetDateTime.now();
        this.user = null; // Can be set explicitly if needed
    }

    public static GarmentTestBuilder aGarment() {
        return new GarmentTestBuilder();
    }

    public GarmentTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public GarmentTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public GarmentTestBuilder withDescription(String description) {
        this.description = description;
        return this;
    }

    public GarmentTestBuilder withImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public GarmentTestBuilder withUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public GarmentEntity build() {
        GarmentEntity garment = new GarmentEntity();
        garment.setId(this.id);
        garment.setName(this.name);
        garment.setDescription(this.description);
        garment.setImageUrl(this.imageUrl);
        garment.setCreatedAt(this.createdAt);
        garment.setUpdatedAt(this.updatedAt);
        garment.setUser(this.user);
        return garment;
    }
}