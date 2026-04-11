package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorLabelRequest(
        String label,
        Double score
) {
}
