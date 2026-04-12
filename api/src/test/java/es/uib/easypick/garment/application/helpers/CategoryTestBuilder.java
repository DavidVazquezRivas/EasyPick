package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.application.entities.CategoryEntity;

import java.util.UUID;

/**
 * Test Data Builder for CategoryEntity.
 */
public class CategoryTestBuilder {

    private UUID id;
    private String name;
    private String description;

    private CategoryTestBuilder() {
        this.id = UUID.randomUUID();
        this.name = "Default Category";
        this.description = "Default category description";
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

    public CategoryEntity build() {
        CategoryEntity category = new CategoryEntity();
        category.setId(this.id);
        category.setName(this.name);
        category.setDescription(this.description);
        return category;
    }
}