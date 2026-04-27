from __future__ import annotations

from PIL import Image

from app.config import SETTINGS
from app.domain.models.garment import Garment
from app.domain.models.label_prediction import LabelPrediction
from app.processing.response_builder import ProcessedGarmentResponseBuilder


def test_response_builder_maps_predicted_names_to_uuid_ids() -> None:
    original_maps = (
        dict(SETTINGS.category_label_ids_by_name),
        dict(SETTINGS.color_label_ids_by_name),
        dict(SETTINGS.style_label_ids_by_name),
        dict(SETTINGS.brand_label_ids_by_name),
    )

    SETTINGS.update_classifier_labels(
        category_label_ids_by_name={"shirt": "cat-uuid-1"},
        color_label_ids_by_name={"blue": "color-uuid-1"},
        style_label_ids_by_name={"casual": "style-uuid-1"},
        brand_label_ids_by_name={"zara": "brand-uuid-1"},
    )

    try:
        garment = Garment(
            image=Image.new("RGB", (8, 8), color="white"),
            detection_confidence=0.9,
            labels={
                "category": LabelPrediction(label="Shirt", score=0.95),
                "color": LabelPrediction(label="blue", score=0.90),
                "style": LabelPrediction(label="CASUAL", score=0.85),
                "material": LabelPrediction(label="cotton", score=0.80),
                "season": LabelPrediction(label="summer", score=0.70),
                "brand": LabelPrediction(label="Zara", score=0.99),
            },
        )

        built = ProcessedGarmentResponseBuilder().build_many([garment])

        assert len(built) == 1
        item = built[0]
        assert item.category == "cat-uuid-1"
        assert item.color == "color-uuid-1"
        assert item.style == "style-uuid-1"
        assert item.brand == "brand-uuid-1"
        assert item.warmth_index is None
        assert item.image_base64
    finally:
        SETTINGS.update_classifier_labels(
            category_label_ids_by_name=original_maps[0],
            color_label_ids_by_name=original_maps[1],
            style_label_ids_by_name=original_maps[2],
            brand_label_ids_by_name=original_maps[3],
        )


def test_response_builder_returns_null_when_uuid_mapping_missing() -> None:
    original_maps = (
        dict(SETTINGS.category_label_ids_by_name),
        dict(SETTINGS.color_label_ids_by_name),
        dict(SETTINGS.style_label_ids_by_name),
        dict(SETTINGS.brand_label_ids_by_name),
    )

    SETTINGS.update_classifier_labels(
        category_label_ids_by_name={},
        color_label_ids_by_name={},
        style_label_ids_by_name={},
        brand_label_ids_by_name={},
    )

    try:
        garment = Garment(
            image=Image.new("RGB", (8, 8), color="white"),
            detection_confidence=0.9,
            labels={
                "category": LabelPrediction(label="shirt", score=0.95),
                "color": LabelPrediction(label="blue", score=0.90),
                "style": LabelPrediction(label="casual", score=0.85),
                "material": LabelPrediction(label="cotton", score=0.80),
                "season": LabelPrediction(label="summer", score=0.70),
                "brand": LabelPrediction(label="zara", score=0.99),
            },
        )

        built = ProcessedGarmentResponseBuilder().build_many([garment])

        item = built[0]
        assert item.category is None
        assert item.color is None
        assert item.style is None
        assert item.brand is None
    finally:
        SETTINGS.update_classifier_labels(
            category_label_ids_by_name=original_maps[0],
            color_label_ids_by_name=original_maps[1],
            style_label_ids_by_name=original_maps[2],
            brand_label_ids_by_name=original_maps[3],
        )
