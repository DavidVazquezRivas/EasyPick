from __future__ import annotations

from uuid import uuid4

from app.models.garment_labels import GarmentLabels
from app.models.label_score import LabelScore
from app.models.processed_garment import ProcessedGarment
from app.processing.orchestrator import OrchestratedGarment
from app.utils.image_io import bytes_to_base64, image_to_png_bytes


class ProcessedGarmentResponseBuilder:
    def build_one(self, garment: OrchestratedGarment) -> ProcessedGarment:
        png_bytes = image_to_png_bytes(garment.image)
        image_base64 = bytes_to_base64(png_bytes)

        return ProcessedGarment(
            temp_id=str(uuid4()),
            detection_confidence=garment.detection_confidence,
            labels=GarmentLabels(
                category=LabelScore(
                    label=garment.labels["category"].label,
                    score=garment.labels["category"].score,
                ),
                color=LabelScore(
                    label=garment.labels["color"].label,
                    score=garment.labels["color"].score,
                ),
                style=LabelScore(
                    label=garment.labels["style"].label,
                    score=garment.labels["style"].score,
                ),
                material=LabelScore(
                    label=garment.labels["material"].label,
                    score=garment.labels["material"].score,
                ),
                season=LabelScore(
                    label=garment.labels["season"].label,
                    score=garment.labels["season"].score,
                ),
            ),
            image_base64=image_base64,
            mime_type="image/png",
        )

    def build_many(self, garments: list[OrchestratedGarment]) -> list[ProcessedGarment]:
        return [self.build_one(garment) for garment in garments]
