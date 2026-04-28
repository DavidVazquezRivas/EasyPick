from __future__ import annotations

from dataclasses import dataclass, field
import os


def _env_str(name: str, default: str) -> str:
    value = os.getenv(name)
    if value is None:
        return default
    normalized = value.strip()
    return normalized or default


def _env_float(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return float(value)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "y", "on"}:
        return True
    if normalized in {"0", "false", "no", "n", "off"}:
        return False
    return default


def _normalize_label_key(value: str) -> str:
    return value.strip().lower()


DEFAULT_CATEGORY_LABELS: tuple[str, ...] = (
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

DEFAULT_COLOR_LABELS: tuple[str, ...] = (
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

DEFAULT_STYLE_LABELS: tuple[str, ...] = (
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

DEFAULT_MATERIAL_LABELS: tuple[str, ...] = (
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

DEFAULT_SEASON_LABELS: tuple[str, ...] = (
    "spring",
    "summer",
    "autumn",
    "winter",
)

DEFAULT_BRAND_LABELS: tuple[str, ...] = (
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "Gucci",
    "Prada",
    "Zara",
    "H&M",
    "Forever 21",
    "ASOS",
    "Levis",
    "Tommy Hilfiger",
    "Calvin Klein",
    "Ralph Lauren",
    "Unknown",
)

DEFAULT_WARMTH_MATERIAL_VALUES_BY_NAME: dict[str, float] = {
    "linen": 1.0,
    "silk": 2.0,
    "cotton": 4.0,
    "polyester": 5.0,
    "denim": 6.0,
    "leather": 7.0,
    "knit": 7.0,
    "wool": 9.0,
    "fleece": 10.0,
}

DEFAULT_WARMTH_SEASON_VALUES_BY_NAME: dict[str, float] = {
    "summer": 1.0,
    "spring": 4.0,
    "autumn": 7.0,
    "winter": 10.0,
}


@dataclass
class Settings:
    max_upload_size_bytes: int = 15 * 1024 * 1024
    min_image_width: int = 32
    min_image_height: int = 32
    max_image_width: int = 8192
    max_image_height: int = 8192
    use_gpu: bool = False
    segmentation_enabled: bool = True
    segmentation_backend: str = "grounding_dino"
    segmentation_model_name: str = "facebook/sam-vit-base"
    segmentation_top_k_masks: int = 30
    segmentation_min_mask_area_px: int = 50000
    segmentation_max_mask_area_ratio: float = 0.7
    segmentation_max_bbox_area_ratio: float = 0.6
    segmentation_min_mask_fill_ratio: float = 0.45
    segmentation_bbox_iou_dedup_threshold: float = 0.65
    segmentation_containment_threshold: float = 0.9
    segmentation_dino_model_id: str = "IDEA-Research/grounding-dino-tiny"
    segmentation_dino_text_prompt: str = (
        "folded clothes. clothes on hanger. shirt. pants. jeans. sweater. "
        "jacket. dress. skirt. shorts. coat. footwear. shoes. glasses. sunglasses. "
        "hat. cap. beanie. scarf. belt. bag. backpack."
    )
    segmentation_dino_box_threshold: float = 0.30
    segmentation_dino_text_threshold: float = 0.25
    segmentation_dino_max_boxes: int = 30
    segmentation_dino_nms_iou_threshold: float = 0.75
    segmentation_dino_single_box_containment_threshold: float = 0.80
    segmentation_dino_max_generic_clothes_area_ratio: float = 0.60
    segmentation_dino_bbox_padding_ratio: float = 0.08
    segmentation_log_stage_metrics: bool = True
    pipeline_log_stage_metrics: bool = True
    clip_model_name: str = "openai/clip-vit-base-patch32"
    clip_top_k: int = 3
    clip_min_confidence: float = 0.15
    garment_filter_enabled: bool = True
    garment_filter_min_score: float = 0.55
    garment_filter_margin: float = 0.05
    api_base_url: str = _env_str("EASYPICK_API_BASE_URL", "http://localhost:8080/api/v1")
    auth_refresh_token: str = _env_str("EASYPICK_REFRESH_TOKEN", "")
    auth_refresh_endpoint: str = _env_str("EASYPICK_AUTH_REFRESH_ENDPOINT", "/auth/refresh")
    garment_config_endpoint: str = _env_str("GARMENT_CONFIG_ENDPOINT", "/garments/configurations")
    garment_config_timeout_seconds: float = _env_float("GARMENT_CONFIG_TIMEOUT_SECONDS", 5.0)
    sync_garment_labels_on_startup: bool = _env_bool("SYNC_GARMENT_LABELS_ON_STARTUP", True)
    category_labels: tuple[str, ...] = DEFAULT_CATEGORY_LABELS
    color_labels: tuple[str, ...] = DEFAULT_COLOR_LABELS
    style_labels: tuple[str, ...] = DEFAULT_STYLE_LABELS
    material_labels: tuple[str, ...] = DEFAULT_MATERIAL_LABELS
    season_labels: tuple[str, ...] = DEFAULT_SEASON_LABELS
    brand_labels: tuple[str, ...] = DEFAULT_BRAND_LABELS
    category_label_ids_by_name: dict[str, str] = field(default_factory=dict)
    color_label_ids_by_name: dict[str, str] = field(default_factory=dict)
    style_label_ids_by_name: dict[str, str] = field(default_factory=dict)
    brand_label_ids_by_name: dict[str, str] = field(default_factory=dict)
    warmth_category_values_by_name: dict[str, float] = field(default_factory=dict)
    warmth_color_modifiers_by_name: dict[str, float] = field(default_factory=dict)
    warmth_material_values_by_name: dict[str, float] = field(
        default_factory=lambda: dict(DEFAULT_WARMTH_MATERIAL_VALUES_BY_NAME)
    )
    warmth_season_values_by_name: dict[str, float] = field(
        default_factory=lambda: dict(DEFAULT_WARMTH_SEASON_VALUES_BY_NAME)
    )

    def update_classifier_labels(
        self,
        *,
        category_labels: tuple[str, ...] | None = None,
        color_labels: tuple[str, ...] | None = None,
        style_labels: tuple[str, ...] | None = None,
        brand_labels: tuple[str, ...] | None = None,
        category_label_ids_by_name: dict[str, str] | None = None,
        color_label_ids_by_name: dict[str, str] | None = None,
        style_label_ids_by_name: dict[str, str] | None = None,
        brand_label_ids_by_name: dict[str, str] | None = None,
        warmth_category_values_by_name: dict[str, float] | None = None,
        warmth_color_modifiers_by_name: dict[str, float] | None = None,
        warmth_material_values_by_name: dict[str, float] | None = None,
        warmth_season_values_by_name: dict[str, float] | None = None,
    ) -> None:
        if category_labels:
            self.category_labels = category_labels
        if color_labels:
            self.color_labels = color_labels
        if style_labels:
            self.style_labels = style_labels
        if brand_labels:
            self.brand_labels = brand_labels
        if category_label_ids_by_name is not None:
            self.category_label_ids_by_name = category_label_ids_by_name
        if color_label_ids_by_name is not None:
            self.color_label_ids_by_name = color_label_ids_by_name
        if style_label_ids_by_name is not None:
            self.style_label_ids_by_name = style_label_ids_by_name
        if brand_label_ids_by_name is not None:
            self.brand_label_ids_by_name = brand_label_ids_by_name
        if warmth_category_values_by_name is not None:
            self.warmth_category_values_by_name = warmth_category_values_by_name
        if warmth_color_modifiers_by_name is not None:
            self.warmth_color_modifiers_by_name = warmth_color_modifiers_by_name
        if warmth_material_values_by_name is not None:
            self.warmth_material_values_by_name = warmth_material_values_by_name
        if warmth_season_values_by_name is not None:
            self.warmth_season_values_by_name = warmth_season_values_by_name

    def resolve_classifier_label_id(self, dimension: str, label_name: str) -> str | None:
        normalized = _normalize_label_key(label_name)
        if not normalized:
            return None

        if dimension == "category":
            return self.category_label_ids_by_name.get(normalized)
        if dimension == "color":
            return self.color_label_ids_by_name.get(normalized)
        if dimension == "style":
            return self.style_label_ids_by_name.get(normalized)
        if dimension == "brand":
            return self.brand_label_ids_by_name.get(normalized)

        return None


SETTINGS = Settings()

CATEGORY_LABELS: tuple[str, ...] = DEFAULT_CATEGORY_LABELS
COLOR_LABELS: tuple[str, ...] = DEFAULT_COLOR_LABELS
STYLE_LABELS: tuple[str, ...] = DEFAULT_STYLE_LABELS
MATERIAL_LABELS: tuple[str, ...] = DEFAULT_MATERIAL_LABELS
SEASON_LABELS: tuple[str, ...] = DEFAULT_SEASON_LABELS
BRAND_LABELS: tuple[str, ...] = DEFAULT_BRAND_LABELS

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
