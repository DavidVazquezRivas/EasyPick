from __future__ import annotations

from dataclasses import dataclass

from PIL import Image

from app.domain.models.label_prediction import LabelPrediction


@dataclass(frozen=True)
class Garment:
    image: Image.Image
    detection_confidence: float
    labels: dict[str, LabelPrediction]
    warmth_index: float | None = None