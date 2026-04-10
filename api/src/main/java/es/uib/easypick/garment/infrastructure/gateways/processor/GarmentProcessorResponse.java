package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record GarmentProcessorResponse(
        String imageBase64

        // TODO other garment fields like category, color, material, etc.
) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorHttpResponse(
        List<ProcessorGarmentPayload> garments
) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorGarmentPayload(
        @JsonProperty("image_base64") String imageBase64
) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorErrorResponse(
        String detail
) {
}
