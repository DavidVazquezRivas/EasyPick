from __future__ import annotations

from uuid import uuid4

from app.models.garment_labels import GarmentLabels
from app.models.label_score import LabelScore
from app.models.processed_garment import ProcessedGarment
from app.services.background_service import BackgroundRemover
from app.services.clip_service import ClipTagger
from app.services.yolo_service import YoloGarmentDetector
from app.utils.image_io import bytes_to_base64, image_to_png_bytes


class GarmentProcessingPipeline:
    def __init__(
        self,
        detector: YoloGarmentDetector,
        background_remover: BackgroundRemover,
        clip_tagger: ClipTagger,
    ) -> None:
        self._detector = detector
        self._background_remover = background_remover
        self._clip_tagger = clip_tagger

    def process(self, image) -> list[ProcessedGarment]:
        crops = self._detector.detect_and_crop(image)
        garments: list[ProcessedGarment] = []

        for crop in crops:
            no_bg_image = self._background_remover.remove_background(crop.image)
            labels = self._clip_tagger.classify(no_bg_image)

            png_bytes = image_to_png_bytes(no_bg_image)
            image_base64 = bytes_to_base64(png_bytes)

            garments.append(
                ProcessedGarment(
                    temp_id=str(uuid4()),
                    detection_confidence=crop.confidence,
                    labels=GarmentLabels(
                        category=LabelScore(
                            label=labels["category"].label,
                            score=labels["category"].score,
                        ),
                        color=LabelScore(
                            label=labels["color"].label,
                            score=labels["color"].score,
                        ),
                        style=LabelScore(
                            label=labels["style"].label,
                            score=labels["style"].score,
                        ),
                        material=LabelScore(
                            label=labels["material"].label,
                            score=labels["material"].score,
                        ),
                        season=LabelScore(
                            label=labels["season"].label,
                            score=labels["season"].score,
                        ),
                    ),
                    image_base64=image_base64,
                    mime_type="image/png",
                )
            )

        return garments
