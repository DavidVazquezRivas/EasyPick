package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorGarmentRequest(
        @JsonProperty("temp_id") String tempId,
        @JsonProperty("detection_confidence") Double detectionConfidence,
        ProcessorGarmentLabelsRequest labels,
        @JsonProperty("image_base64") String imageBase64
) {
}
