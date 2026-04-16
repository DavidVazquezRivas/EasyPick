from __future__ import annotations

from typing import Protocol

from PIL import Image

from app.domain.models.label_prediction import LabelPrediction


class ClassifierPort(Protocol):
    def classify(self, image: Image.Image) -> dict[str, LabelPrediction]:
        ...