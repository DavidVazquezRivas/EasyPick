package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.*;
import es.uib.easypick.user.application.entities.UserEntity;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
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
    private Integer warmthIndex;
    private Integer preferenceScore;
    private GarmentStatus status;

    // Relationships
    private UserEntity user;
    private BrandEntity brand;
    private StyleEntity style;
    private CategoryEntity category;
    private Set<ColorEntity> colors;

    private GarmentTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Default T-Shirt";
        this.description = "Default T-Shirt long description to ensure we meet any length requirements.";
        this.imageUrl = "https://example.com/default-tshirt.jpg";
        this.createdAt = OffsetDateTime.now().minusDays(1);
        this.updatedAt = OffsetDateTime.now();

        this.warmthIndex = 0;
        this.preferenceScore = 0;

        this.status = GarmentStatus.CONFIRMED;

        this.user = null; // Can be set explicitly if needed
        this.brand = null;
        this.style = null;
        this.category = null;
        this.colors = new HashSet<>(); // Always initialize collections to avoid NPEs in tests
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

    public GarmentTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public GarmentTestBuilder withUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
        return this;
    }

    public GarmentTestBuilder withWarmthIndex(Integer warmthIndex) {
        this.warmthIndex = warmthIndex;
        return this;
    }

    public GarmentTestBuilder withPreferenceScore(Integer preferenceScore) {
        this.preferenceScore = preferenceScore;
        return this;
    }

    public GarmentTestBuilder withStatus(GarmentStatus status) {
        this.status = status;
        return this;
    }

    public GarmentTestBuilder withUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public GarmentTestBuilder withBrand(BrandEntity brand) {
        this.brand = brand;
        return this;
    }

    public GarmentTestBuilder withStyle(StyleEntity style) {
        this.style = style;
        return this;
    }

    public GarmentTestBuilder withCategory(CategoryEntity category) {
        this.category = category;
        return this;
    }

    public GarmentTestBuilder withColors(Set<ColorEntity> colors) {
        this.colors = colors;
        return this;
    }

    /**
     * Helper method to add a single color easily during test setup.
     */
    public GarmentTestBuilder withColor(ColorEntity color) {
        this.colors.add(color);
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
        garment.setWarmthIndex(this.warmthIndex);
        garment.setPreferenceScore(this.preferenceScore);
        garment.setStatus(this.status);

        garment.setUser(this.user);
        garment.setBrand(this.brand);
        garment.setStyle(this.style);
        garment.setCategory(this.category);

        for (ColorEntity color : this.colors) {
            garment.addColor(color);
        }

        return garment;
    }
}