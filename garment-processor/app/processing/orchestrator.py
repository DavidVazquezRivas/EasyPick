from __future__ import annotations

from dataclasses import dataclass

from PIL import Image

from app.config import SETTINGS
from app.services.background_service import BackgroundRemover
from app.services.clip_service import ClipResult, ClipTagger
from app.services.garment_filter_service import ClipGarmentFilter
from app.services.segmentation_service import SamSegmentationService
from app.services.yolo_service import YoloGarmentDetector


@dataclass(frozen=True)
class OrchestratedGarment:
    image: Image.Image
    detection_confidence: float
    labels: dict[str, ClipResult]


class GarmentProcessingOrchestrator:
    def __init__(
        self,
        detector: YoloGarmentDetector,
        background_remover: BackgroundRemover,
        clip_tagger: ClipTagger,
        garment_filter: ClipGarmentFilter,
        segmenter: SamSegmentationService | None = None,
    ) -> None:
        self._detector = detector
        self._background_remover = background_remover
        self._clip_tagger = clip_tagger
        self._garment_filter = garment_filter
        self._segmenter = segmenter

    def process(self, image: Image.Image) -> list[OrchestratedGarment]:
        candidates: list[tuple[Image.Image, float]] = []

        if SETTINGS.segmentation_enabled and self._segmenter is not None:
            try:
                segments = self._segmenter.segment(image)
                candidates.extend((segment.image, segment.confidence) for segment in segments)
            except Exception:
                if not SETTINGS.segmentation_fallback_to_yolo:
                    raise

        if not candidates and SETTINGS.segmentation_fallback_to_yolo:
            crops = self._detector.detect_and_crop(image)
            candidates.extend((crop.image, crop.confidence) for crop in crops)

        garments: list[OrchestratedGarment] = []

        for candidate_image, candidate_confidence in candidates:
            filter_decision = self._garment_filter.is_garment(candidate_image)
            if SETTINGS.garment_filter_enabled and not filter_decision.is_garment:
                continue

            no_bg_image = self._background_remover.remove_background(candidate_image)
            labels = self._clip_tagger.classify(no_bg_image)

            garments.append(
                OrchestratedGarment(
                    image=no_bg_image,
                    detection_confidence=candidate_confidence,
                    labels=labels,
                )
            )

        return garments
