package es.uib.easypick.garment.infrastructure.gateways.processor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProcessorGarmentLabelsRequest(
        ProcessorLabelRequest category,
        ProcessorLabelRequest color,
        ProcessorLabelRequest style,
        ProcessorLabelRequest material,
        ProcessorLabelRequest season,
        ProcessorLabelRequest brand
) {
}
