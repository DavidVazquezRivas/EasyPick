from __future__ import annotations

from uuid import uuid4

from app.domain.models.garment import Garment
from app.models.garment_labels import GarmentLabels
from app.models.label_score import LabelScore
from app.models.processed_garment import ProcessedGarment
from app.utils.image_io import bytes_to_base64, image_to_png_bytes


class ProcessedGarmentResponseBuilder:
    def _build_labels(self, garment: Garment) -> GarmentLabels:
        return GarmentLabels(
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
            brand=LabelScore(
                label=garment.labels["brand"].label,
                score=garment.labels["brand"].score,
            ),
        )

    def build_many(self, garments: list[Garment]) -> tuple[list[str], list[ProcessedGarment]]:
        garment_pngs_base64: list[str] = []
        processed_garments: list[ProcessedGarment] = []

        for index, garment in enumerate(garments):
            image_base64 = bytes_to_base64(image_to_png_bytes(garment.image))
            garment_pngs_base64.append(image_base64)
            processed_garments.append(
                ProcessedGarment(
                    temp_id=str(uuid4()),
                    detection_confidence=garment.detection_confidence,
                    labels=self._build_labels(garment),
                    image_index=index,
                    image_base64=image_base64,
                    mime_type="image/png",
                )
            )

        return garment_pngs_base64, processed_garments
