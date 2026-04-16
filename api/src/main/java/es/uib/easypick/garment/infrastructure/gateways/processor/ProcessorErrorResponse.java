package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorErrorResponse(
        String detail
) {
}
