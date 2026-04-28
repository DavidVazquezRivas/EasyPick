from __future__ import annotations

from PIL import Image

from app.config import SETTINGS
from app.domain.models.garment import Garment
from app.domain.models.label_prediction import LabelPrediction
from app.use_cases.calculate_warmth_index_use_case import CalculateWarmthIndexUseCase


def _garment_with_labels(labels: dict[str, LabelPrediction]) -> Garment:
    return Garment(
        image=Image.new("RGB", (8, 8), color="white"),
        detection_confidence=0.9,
        labels=labels,
    )


def test_calculate_warmth_index_happy_path() -> None:
    use_case = CalculateWarmthIndexUseCase()
    original = (
        dict(SETTINGS.warmth_material_values_by_name),
        dict(SETTINGS.warmth_category_values_by_name),
        dict(SETTINGS.warmth_season_values_by_name),
        dict(SETTINGS.warmth_color_modifiers_by_name),
    )
    SETTINGS.update_classifier_labels(
        warmth_material_values_by_name={"wool": 9.0},
        warmth_category_values_by_name={"coat": 10.0},
        warmth_season_values_by_name={"winter": 10.0},
        warmth_color_modifiers_by_name={"black": 0.2},
    )
    garment = _garment_with_labels(
        {
            "material": LabelPrediction(label="wool", score=0.9),
            "category": LabelPrediction(label="coat", score=0.9),
            "season": LabelPrediction(label="winter", score=0.9),
            "color": LabelPrediction(label="black", score=0.9),
        }
    )

    try:
        result = use_case.execute([garment])
    finally:
        SETTINGS.update_classifier_labels(
            warmth_material_values_by_name=original[0],
            warmth_category_values_by_name=original[1],
            warmth_season_values_by_name=original[2],
            warmth_color_modifiers_by_name=original[3],
        )

    assert len(result) == 1
    assert result[0].warmth_index == 9.75


def test_calculate_warmth_index_uses_neutral_values_for_missing_attributes() -> None:
    use_case = CalculateWarmthIndexUseCase()
    original = (
        dict(SETTINGS.warmth_material_values_by_name),
        dict(SETTINGS.warmth_category_values_by_name),
        dict(SETTINGS.warmth_season_values_by_name),
        dict(SETTINGS.warmth_color_modifiers_by_name),
    )
    SETTINGS.update_classifier_labels(
        warmth_material_values_by_name={},
        warmth_category_values_by_name={},
        warmth_season_values_by_name={},
        warmth_color_modifiers_by_name={},
    )
    garment = _garment_with_labels(
        {
            "category": LabelPrediction(label="", score=0.9),
            "color": LabelPrediction(label="", score=0.9),
        }
    )

    try:
        result = use_case.execute([garment])
    finally:
        SETTINGS.update_classifier_labels(
            warmth_material_values_by_name=original[0],
            warmth_category_values_by_name=original[1],
            warmth_season_values_by_name=original[2],
            warmth_color_modifiers_by_name=original[3],
        )

    assert result[0].warmth_index == 5.0


def test_calculate_warmth_index_clamps_and_rounds() -> None:
    use_case = CalculateWarmthIndexUseCase()
    original = (
        dict(SETTINGS.warmth_material_values_by_name),
        dict(SETTINGS.warmth_category_values_by_name),
        dict(SETTINGS.warmth_season_values_by_name),
        dict(SETTINGS.warmth_color_modifiers_by_name),
    )
    SETTINGS.update_classifier_labels(
        warmth_material_values_by_name={"fleece": 10.0, "linen": 1.0},
        warmth_category_values_by_name={"coat": 10.0, "swimsuit": 1.0},
        warmth_season_values_by_name={"winter": 10.0, "summer": 1.0},
        warmth_color_modifiers_by_name={"black": 0.2, "white": -0.2},
    )
    warm_garment = _garment_with_labels(
        {
            "material": LabelPrediction(label="fleece", score=0.9),
            "category": LabelPrediction(label="coat", score=0.9),
            "season": LabelPrediction(label="winter", score=0.9),
            "color": LabelPrediction(label="black", score=0.9),
        }
    )
    cool_garment = _garment_with_labels(
        {
            "material": LabelPrediction(label="linen", score=0.9),
            "category": LabelPrediction(label="swimsuit", score=0.9),
            "season": LabelPrediction(label="summer", score=0.9),
            "color": LabelPrediction(label="white", score=0.9),
        }
    )

    try:
        result = use_case.execute([warm_garment, cool_garment])
    finally:
        SETTINGS.update_classifier_labels(
            warmth_material_values_by_name=original[0],
            warmth_category_values_by_name=original[1],
            warmth_season_values_by_name=original[2],
            warmth_color_modifiers_by_name=original[3],
        )

    assert result[0].warmth_index == 10.0
    assert result[1].warmth_index == 1.0
