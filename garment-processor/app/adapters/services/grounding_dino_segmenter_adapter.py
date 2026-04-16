from __future__ import annotations

from PIL import Image

from app.domain.models.candidate import Candidate
from app.domain.ports.segmenter_port import SegmenterPort
from app.services.grounding_dino_segmentation_service import GroundingDinoSegmentationService


class GroundingDinoSegmenterAdapter(SegmenterPort):
    def __init__(self, service: GroundingDinoSegmentationService) -> None:
        self._service = service

    def segment(self, image: Image.Image) -> list[Candidate]:
        raw_candidates = self._service.segment(image)
        return [
            Candidate(
                image=item.image,
                confidence=item.confidence,
                bbox=item.bbox,
                area_px=item.area_px,
            )
            for item in raw_candidates
        ]