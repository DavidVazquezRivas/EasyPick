from __future__ import annotations

from PIL import Image
import pytest

from app.domain.exceptions import DetectionFailure
from app.domain.models.candidate import Candidate
from app.domain.models.label_prediction import LabelPrediction
from app.domain.ports.garment_filter_port import GarmentFilterDecision
from app.exceptions import ClipClassificationError
from app.use_cases.process_garments_use_case import ProcessGarmentsUseCase


class _SegmenterOk:
    def segment(self, image: Image.Image) -> list[Candidate]:
        return [
            Candidate(
                image=image,
                confidence=0.9,
                bbox=(0, 0, image.size[0], image.size[1]),
                area_px=image.size[0] * image.size[1],
            )
        ]


class _SegmenterFail:
    def segment(self, image: Image.Image) -> list[Candidate]:
        raise RuntimeError("segmentation exploded")


class _FilterAlwaysGarment:
    def is_garment(self, image: Image.Image) -> GarmentFilterDecision:
        return GarmentFilterDecision(is_garment=True, garment_score=0.9, non_garment_score=0.1)


class _BgPassthrough:
    def remove_background(self, image: Image.Image) -> Image.Image:
        return image


class _ClassifierFixed:
    def classify(self, image: Image.Image) -> dict[str, LabelPrediction]:
        return {
            "category": LabelPrediction(label="t-shirt", score=0.9),
            "color": LabelPrediction(label="blue", score=0.9),
            "style": LabelPrediction(label="casual", score=0.9),
            "material": LabelPrediction(label="cotton", score=0.9),
            "season": LabelPrediction(label="summer", score=0.9),
            "brand": LabelPrediction(label="Unknown", score=0.9),
        }


class _ClassifierFail:
    def classify(self, image: Image.Image) -> dict[str, LabelPrediction]:
        raise ClipClassificationError("clip failed")


def test_use_case_returns_garment_on_happy_path() -> None:
    image = Image.new("RGB", (32, 32), color="white")
    use_case = ProcessGarmentsUseCase(
        segmenter=_SegmenterOk(),
        garment_filter=_FilterAlwaysGarment(),
        background_remover=_BgPassthrough(),
        classifier=_ClassifierFixed(),
    )

    garments = use_case.execute(image)

    assert len(garments) == 1
    assert garments[0].detection_confidence == 0.9
    assert garments[0].labels["category"].label == "t-shirt"


def test_use_case_wraps_segmenter_failures() -> None:
    image = Image.new("RGB", (32, 32), color="white")
    use_case = ProcessGarmentsUseCase(
        segmenter=_SegmenterFail(),
        garment_filter=_FilterAlwaysGarment(),
        background_remover=_BgPassthrough(),
        classifier=_ClassifierFixed(),
    )

    with pytest.raises(DetectionFailure):
        use_case.execute(image)


def test_use_case_uses_default_labels_when_classifier_fails() -> None:
    image = Image.new("RGB", (32, 32), color="white")
    use_case = ProcessGarmentsUseCase(
        segmenter=_SegmenterOk(),
        garment_filter=_FilterAlwaysGarment(),
        background_remover=_BgPassthrough(),
        classifier=_ClassifierFail(),
    )

    garments = use_case.execute(image)

    assert len(garments) == 1
    assert garments[0].labels["category"].label == "t-shirt"
    assert garments[0].labels["category"].score == 0.0
