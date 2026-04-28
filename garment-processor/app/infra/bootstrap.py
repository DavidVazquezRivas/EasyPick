from __future__ import annotations

from dataclasses import dataclass
from typing import cast

from transformers import CLIPModel, CLIPProcessor

from app.adapters.services import (
    ClipClassifierAdapter,
    ClipGarmentFilterAdapter,
    GroundingDinoSegmenterAdapter,
)
from app.config import SETTINGS
from app.processing.response_builder import ProcessedGarmentResponseBuilder
from app.services.background_service import BackgroundRemover
from app.services.clip_service import ClipTagger
from app.services.garment_filter_service import ClipGarmentFilter
from app.services.grounding_dino_segmentation_service import GroundingDinoSegmentationService
from app.use_cases import CalculateWarmthIndexUseCase, ProcessGarmentsUseCase


@dataclass(frozen=True)
class RuntimeComponents:
    process_garments_use_case: ProcessGarmentsUseCase
    calculate_warmth_index_use_case: CalculateWarmthIndexUseCase
    response_builder: ProcessedGarmentResponseBuilder


def build_runtime_components(device: str) -> RuntimeComponents:
    clip_model = cast(CLIPModel, CLIPModel.from_pretrained(SETTINGS.clip_model_name))
    clip_model = clip_model.to(device)  # pyright: ignore[reportArgumentType]
    clip_model.eval()
    clip_processor = cast(CLIPProcessor, CLIPProcessor.from_pretrained(SETTINGS.clip_model_name))

    segmenter: GroundingDinoSegmentationService | None = None
    if SETTINGS.segmentation_enabled:
        segmenter = GroundingDinoSegmentationService.create_default()
        if device == "cuda":
            segmenter.to_device(device)

    if segmenter is None:
        raise RuntimeError("Grounding DINO segmenter is required when segmentation is enabled")

    use_case = ProcessGarmentsUseCase(
        segmenter=GroundingDinoSegmenterAdapter(segmenter),
        garment_filter=ClipGarmentFilterAdapter(
            ClipGarmentFilter(model=clip_model, processor=clip_processor)
        ),
        background_remover=BackgroundRemover(),
        classifier=ClipClassifierAdapter(ClipTagger(model=clip_model, processor=clip_processor)),
    )

    return RuntimeComponents(
        process_garments_use_case=use_case,
        calculate_warmth_index_use_case=CalculateWarmthIndexUseCase(),
        response_builder=ProcessedGarmentResponseBuilder(),
    )