from __future__ import annotations

from dataclasses import replace

from app.config import SETTINGS
from app.domain.models.garment import Garment

_DEFAULT_NEUTRAL_VALUE = 5.0


class CalculateWarmthIndexUseCase:
    def execute(self, garments: list[Garment]) -> list[Garment]:
        return [replace(garment, warmth_index=self._compute(garment)) for garment in garments]

    def _compute(self, garment: Garment) -> float:
        material_value = self._lookup_value(
            garment,
            "material",
            SETTINGS.warmth_material_values_by_name,
        )
        category_value = self._lookup_value(
            garment,
            "category",
            SETTINGS.warmth_category_values_by_name,
        )
        season_value = self._lookup_value(
            garment,
            "season",
            SETTINGS.warmth_season_values_by_name,
        )
        color_modifier = self._color_modifier(
            garment,
            SETTINGS.warmth_color_modifiers_by_name,
        )

        warmth_index = (
            (0.45 * material_value)
            + (0.45 * category_value)
            + (0.10 * season_value)
            + color_modifier
        )

        clamped = max(1.0, min(10.0, warmth_index))
        return round(clamped, 2)

    def _lookup_value(
        self,
        garment: Garment,
        dimension: str,
        values: dict[str, float],
    ) -> float:
        prediction = garment.labels.get(dimension)
        if prediction is None:
            return _DEFAULT_NEUTRAL_VALUE

        normalized = prediction.label.strip().lower()
        if not normalized:
            return _DEFAULT_NEUTRAL_VALUE

        return values.get(normalized, _DEFAULT_NEUTRAL_VALUE)

    def _color_modifier(self, garment: Garment, values: dict[str, float]) -> float:
        prediction = garment.labels.get("color")
        if prediction is None:
            return 0.0

        normalized = prediction.label.strip().lower()
        if not normalized:
            return 0.0

        return values.get(normalized, 0.0)
