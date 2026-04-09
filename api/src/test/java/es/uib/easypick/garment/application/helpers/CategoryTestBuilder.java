package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.CategoryEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Test Data Builder for CategoryEntity.
 * Centralizes the creation of valid Category instances for testing,
 * insulating tests from future changes in the entity's structure.
 */

public class CategoryTestBuilder {

    private UUID id;
    private String name;
    private String description;
    private OffsetDateTime createdAt;

    private CategoryTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Shirts";
        this.description = "General category for upper body garments";
        this.createdAt = OffsetDateTime.now();
    }

    public static CategoryTestBuilder aCategory() {
        return new CategoryTestBuilder();
    }

    public CategoryTestBuilder withId(UUID id) {
        this.id = id;
        return this;
    }

    public CategoryTestBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public CategoryTestBuilder withDescription(String description) {
        this.description = description;
        return this;
    }

    public CategoryTestBuilder withCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public CategoryEntity build() {
        CategoryEntity category = new CategoryEntity();
        category.setId(this.id);
        category.setName(this.name);
        category.setDescription(this.description);
        category.setCreatedAt(this.createdAt);
        return category;
    }
}
