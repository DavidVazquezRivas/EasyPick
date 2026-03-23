package es.uib.easypick.garment.infrastructure.gateways.processor;

public record GarmentProcessorResponse(
        String imageBase64

        // TODO other garment fields like category, color, material, etc.
) {
}
