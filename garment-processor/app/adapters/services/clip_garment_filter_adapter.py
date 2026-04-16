from __future__ import annotations

from PIL import Image

from app.domain.ports.garment_filter_port import GarmentFilterDecision, GarmentFilterPort
from app.services.garment_filter_service import ClipGarmentFilter


class ClipGarmentFilterAdapter(GarmentFilterPort):
    def __init__(self, service: ClipGarmentFilter) -> None:
        self._service = service

    def is_garment(self, image: Image.Image) -> GarmentFilterDecision:
        decision = self._service.is_garment(image)
        return GarmentFilterDecision(
            is_garment=decision.is_garment,
            garment_score=decision.garment_score,
            non_garment_score=decision.non_garment_score,
        )