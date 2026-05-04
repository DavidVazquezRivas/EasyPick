package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.infrastructure.gateways.processor.responses.GarmentProcessorResponseItem;

import java.util.UUID;

/**
 * Test Data Builder for GarmentProcessorResponseItem.
 */
public class GarmentProcessorResponseItemTestBuilder {

    private String tempId;
    private UUID category;
    private UUID color;
    private UUID style;
    private UUID brand;
    private Double warmthIndex;
    private String imageBase64;

    private GarmentProcessorResponseItemTestBuilder() {
        this.tempId = "tmp-1";
        this.category = UUID.randomUUID();
        this.color = UUID.randomUUID();
        this.style = UUID.randomUUID();
        this.brand = UUID.randomUUID();
        this.warmthIndex = 0.5;
        this.imageBase64 = "base64";
    }

    public static GarmentProcessorResponseItemTestBuilder aGarmentProcessorResponseItem() {
        return new GarmentProcessorResponseItemTestBuilder();
    }

    public GarmentProcessorResponseItemTestBuilder withTempId(String tempId) {
        this.tempId = tempId;
        return this;
    }

    public GarmentProcessorResponseItemTestBuilder withCategory(UUID category) {
        this.category = category;
        return this;
    }

    public GarmentProcessorResponseItemTestBuilder withColor(UUID color) {
        this.color = color;
        return this;
    }

    public GarmentProcessorResponseItemTestBuilder withStyle(UUID style) {
        this.style = style;
        return this;
    }

    public GarmentProcessorResponseItemTestBuilder withBrand(UUID brand) {
        this.brand = brand;
        return this;
    }

    public GarmentProcessorResponseItemTestBuilder withWarmthIndex(Double warmthIndex) {
        this.warmthIndex = warmthIndex;
        return this;
    }

    public GarmentProcessorResponseItemTestBuilder withImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
        return this;
    }

    public GarmentProcessorResponseItem build() {
        return GarmentProcessorResponseItem.builder()
                .tempId(this.tempId)
                .category(this.category)
                .color(this.color)
                .style(this.style)
                .brand(this.brand)
                .warmthIndex(this.warmthIndex)
                .imageBase64(this.imageBase64)
                .build();
    }
}