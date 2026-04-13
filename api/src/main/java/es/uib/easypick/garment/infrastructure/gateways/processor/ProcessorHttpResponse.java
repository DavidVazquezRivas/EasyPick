package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorHttpResponse(
        List<ProcessorGarmentRequest> garments
) {
}
