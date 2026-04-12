package es.uib.easypick.garment.application.helpers;

import es.uib.easypick.garment.infrastructure.gateways.processor.GarmentLabelPrediction;

/**
 * Test Data Builder for GarmentLabelPrediction.
 */
public class GarmentLabelPredictionTestBuilder {

    private String label;
    private Double score;

    private GarmentLabelPredictionTestBuilder() {
        this.label = "default-label";
        this.score = 0.9;
    }

    public static GarmentLabelPredictionTestBuilder aGarmentLabelPrediction() {
        return new GarmentLabelPredictionTestBuilder();
    }

    public GarmentLabelPredictionTestBuilder withLabel(String label) {
        this.label = label;
        return this;
    }

    public GarmentLabelPredictionTestBuilder withScore(Double score) {
        this.score = score;
        return this;
    }

    public GarmentLabelPrediction build() {
        return new GarmentLabelPrediction(this.label, this.score);
    }
}