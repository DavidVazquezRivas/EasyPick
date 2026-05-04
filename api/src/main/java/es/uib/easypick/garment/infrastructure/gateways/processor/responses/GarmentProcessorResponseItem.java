package es.uib.easypick.garment.infrastructure.gateways.processor.responses;

import lombok.Builder;

import java.util.UUID;

@Builder
public record GarmentProcessorResponseItem(
        String tempId,
        UUID category,
        UUID color,
        UUID style,
        UUID brand,
        Double warmthIndex,
        String imageBase64
) {
}
