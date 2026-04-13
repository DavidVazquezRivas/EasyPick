package es.uib.easypick.garment.infrastructure.gateways.processor;

public record GarmentLabelPrediction(
        String label,
        Double score
) {
}
