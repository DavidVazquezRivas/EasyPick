from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    max_upload_size_bytes: int = 15 * 1024 * 1024
    min_image_width: int = 32
    min_image_height: int = 32
    max_image_width: int = 8192
    max_image_height: int = 8192
    yolo_model_name: str = "yolov8n.pt"
    yolo_confidence_threshold: float = 0.25
    use_gpu: bool = False
    segmentation_enabled: bool = True
    segmentation_fallback_to_yolo: bool = True
    segmentation_model_name: str = "facebook/sam-vit-base"
    segmentation_top_k_masks: int = 30
    segmentation_min_mask_area_px: int = 50000
    segmentation_max_mask_area_ratio: float = 0.7
    segmentation_max_bbox_area_ratio: float = 0.6
    segmentation_min_mask_fill_ratio: float = 0.45
    segmentation_bbox_iou_dedup_threshold: float = 0.65
    segmentation_containment_threshold: float = 0.9
    yolo_allowed_class_names: tuple[str, ...] = (
        "person",
        "tie",
        "handbag",
        "backpack",
        "suitcase",
    )
    clip_model_name: str = "openai/clip-vit-base-patch32"
    clip_top_k: int = 3
    clip_min_confidence: float = 0.15
    garment_filter_enabled: bool = True
    garment_filter_min_score: float = 0.55
    garment_filter_margin: float = 0.05


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

GARMENT_FILTER_POSITIVE_PROMPTS: tuple[str, ...] = (
    "a garment",
    "a piece of clothing",
    "an apparel item",
    "fashion clothing",
    "a wearable outfit item",
    "a shirt, pants, dress, or jacket",
    "shoes or boots",
    "a hat or cap",
)

GARMENT_FILTER_NEGATIVE_PROMPTS: tuple[str, ...] = (
    "a camera or electronic device",
    "table decor",
    "dried leaves",
    "background surface",
    "a household object",
    "a non-clothing object",
)
