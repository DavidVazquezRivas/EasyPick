package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentLabelPrediction;
import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentProcessorResponse;

/**
 * Test Data Builder for GarmentProcessorResponse.
 */
public class GarmentProcessorResponseTestBuilder {

    private String tempId;
    private Double detectionConfidence;
    private GarmentLabelPrediction category;
    private GarmentLabelPrediction color;
    private GarmentLabelPrediction style;
    private GarmentLabelPrediction material;
    private GarmentLabelPrediction season;
    private GarmentLabelPrediction brand;
    private String imageBase64;

    private GarmentProcessorResponseTestBuilder() {
        this.tempId = "tmp-1";
        this.detectionConfidence = 0.9;
        this.category = GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("category").build();
        this.color = GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("color").build();
        this.style = GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("style").build();
        this.material = GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("material").build();
        this.season = GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("season").build();
        this.brand = GarmentLabelPredictionTestBuilder.aGarmentLabelPrediction().withLabel("brand").build();
        this.imageBase64 = "base64";
    }

    public static GarmentProcessorResponseTestBuilder aGarmentProcessorResponse() {
        return new GarmentProcessorResponseTestBuilder();
    }

    public GarmentProcessorResponseTestBuilder withTempId(String tempId) {
        this.tempId = tempId;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withDetectionConfidence(Double detectionConfidence) {
        this.detectionConfidence = detectionConfidence;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withCategory(GarmentLabelPrediction category) {
        this.category = category;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withColor(GarmentLabelPrediction color) {
        this.color = color;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withStyle(GarmentLabelPrediction style) {
        this.style = style;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withMaterial(GarmentLabelPrediction material) {
        this.material = material;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withSeason(GarmentLabelPrediction season) {
        this.season = season;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withBrand(GarmentLabelPrediction brand) {
        this.brand = brand;
        return this;
    }

    public GarmentProcessorResponseTestBuilder withImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
        return this;
    }

    public GarmentProcessorResponse build() {
        return new GarmentProcessorResponse(
                this.tempId,
                this.detectionConfidence,
                this.category,
                this.color,
                this.style,
                this.material,
                this.season,
                this.brand,
                this.imageBase64
        );
    }
}