from __future__ import annotations

from PIL import Image

from app.domain.models.label_prediction import LabelPrediction
from app.domain.ports.classifier_port import ClassifierPort
from app.services.clip_service import ClipTagger


class ClipClassifierAdapter(ClassifierPort):
    def __init__(self, service: ClipTagger) -> None:
        self._service = service

    def classify(self, image: Image.Image) -> dict[str, LabelPrediction]:
        raw = self._service.classify(image)
        return {
            key: LabelPrediction(label=value.label, score=value.score)
            for key, value in raw.items()
        }