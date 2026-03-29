from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    max_upload_size_bytes: int = 15 * 1024 * 1024
    yolo_model_name: str = "yolov8n.pt"
    yolo_confidence_threshold: float = 0.25
    yolo_allowed_class_names: tuple[str, ...] = (
        "person",
        "tie",
        "handbag",
        "backpack",
        "suitcase",
    )
    clip_model_name: str = "openai/clip-vit-base-patch32"
    clip_top_k: int = 3


SETTINGS = Settings()

CATEGORY_LABELS: tuple[str, ...] = (
    "t-shirt",
    "shirt",
    "blouse",
    "sweater",
    "hoodie",
    "jacket",
    "coat",
    "blazer",
    "dress",
    "skirt",
    "jeans",
    "pants",
    "shorts",
    "leggings",
    "suit",
    "jumpsuit",
    "sportswear",
    "pajamas",
    "swimsuit",
    "underwear",
    "shoes",
    "boots",
    "sneakers",
    "sandals",
    "hat",
    "scarf",
    "gloves",
    "belt",
    "bag",
)

COLOR_LABELS: tuple[str, ...] = (
    "black",
    "white",
    "gray",
    "beige",
    "brown",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "navy",
    "purple",
    "pink",
    "multicolor",
)

STYLE_LABELS: tuple[str, ...] = (
    "casual",
    "formal",
    "sporty",
    "streetwear",
    "bohemian",
    "vintage",
    "minimalist",
    "elegant",
    "business",
    "party",
)

MATERIAL_LABELS: tuple[str, ...] = (
    "cotton",
    "denim",
    "leather",
    "linen",
    "wool",
    "silk",
    "polyester",
    "knit",
    "fleece",
)

SEASON_LABELS: tuple[str, ...] = (
    "spring",
    "summer",
    "autumn",
    "winter",
)
