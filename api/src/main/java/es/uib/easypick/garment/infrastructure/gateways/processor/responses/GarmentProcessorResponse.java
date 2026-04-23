package es.uib.easypick.garment.infrastructure.gateways.processor.responses;

import lombok.Builder;

import java.util.List;

@Builder
public record GarmentProcessorResponse(List<GarmentProcessorResponseItem> garments) {
}
