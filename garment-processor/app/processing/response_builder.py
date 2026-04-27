from __future__ import annotations

from uuid import uuid4

from app.config import SETTINGS
from app.domain.models.garment import Garment
from app.models.processed_garment import ProcessedGarment
from app.utils.image_io import bytes_to_base64, image_to_png_bytes


class ProcessedGarmentResponseBuilder:
    def _resolve_label_uuid(self, garment: Garment, dimension: str) -> str | None:
        prediction = garment.labels.get(dimension)
        if prediction is None:
            return None

        return SETTINGS.resolve_classifier_label_id(dimension, prediction.label)

    def build_many(self, garments: list[Garment]) -> list[ProcessedGarment]:
        processed_garments: list[ProcessedGarment] = []

        for garment in garments:
            image_base64 = bytes_to_base64(image_to_png_bytes(garment.image))
            processed_garments.append(
                ProcessedGarment(
                    tempId=str(uuid4()),
                    category=self._resolve_label_uuid(garment, "category"),
                    color=self._resolve_label_uuid(garment, "color"),
                    style=self._resolve_label_uuid(garment, "style"),
                    brand=self._resolve_label_uuid(garment, "brand"),
                    imageBase64=image_base64,
                )
            )

        return processed_garments
