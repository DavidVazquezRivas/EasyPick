package es.uib.easypick.garment.infrastructure.gateways.processor;

public record GarmentProcessorResponse(
        String tempId,
        Double detectionConfidence,
    GarmentLabelPrediction category,
    GarmentLabelPrediction color,
    GarmentLabelPrediction style,
    GarmentLabelPrediction material,
    GarmentLabelPrediction season,
    GarmentLabelPrediction brand,
        String imageBase64
) {

    public GarmentProcessorResponse(String imageBase64) {
        this(null, null, null, null, null, null, null, null, imageBase64);
    }
}
