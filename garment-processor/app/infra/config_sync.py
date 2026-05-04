from __future__ import annotations

import json
import logging
from typing import Any
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request

from app.config import SETTINGS
from app.infra.main_api_auth import build_main_api_auth_headers

LOGGER = logging.getLogger(__name__)


def _normalize_label_key(value: str) -> str:
    return value.strip().lower()


def sync_garment_labels_from_main_api() -> None:
    if not SETTINGS.sync_garment_labels_on_startup:
        LOGGER.info("Garment label sync disabled by configuration")
        return

    url = urllib_parse.urljoin(
        SETTINGS.api_base_url.rstrip("/") + "/",
        SETTINGS.garment_config_endpoint.lstrip("/"),
    )
    request = urllib_request.Request(url, headers=build_main_api_auth_headers(), method="GET")

    try:
        with urllib_request.urlopen(request, timeout=SETTINGS.garment_config_timeout_seconds) as response:
            status_code = response.getcode()
            if status_code < 200 or status_code >= 300:
                raise RuntimeError(f"Unexpected status code: {status_code}")
            payload = json.loads(response.read().decode("utf-8"))
    except urllib_error.URLError as exc:
        LOGGER.warning("Could not sync garment labels from %s: %s", url, exc)
        return
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        LOGGER.warning("Invalid JSON payload while syncing garment labels from %s: %s", url, exc)
        return
    except Exception as exc:
        LOGGER.warning("Unexpected error while syncing garment labels from %s: %s", url, exc)
        return

    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        LOGGER.warning("Configuration response does not contain a valid 'data' object")
        return

    category_labels, category_label_ids_by_name = _extract_label_catalog(data.get("categories"))
    color_labels, color_label_ids_by_name = _extract_label_catalog(data.get("colors"))
    style_labels, style_label_ids_by_name = _extract_label_catalog(data.get("styles"))
    brand_labels, brand_label_ids_by_name = _extract_label_catalog(data.get("brands"))
    warmth_category_values_by_name = _extract_numeric_values_by_name(
        data.get("categories"),
        candidate_fields=("warmthValue", "warmIndexValue", "warmth", "value"),
    )
    warmth_color_modifiers_by_name = _extract_numeric_values_by_name(
        data.get("colors"),
        candidate_fields=("warmthModifier", "warmIndexModifier", "modifier", "value"),
    )
    warmth_material_values_by_name = None
    if "materials" in data:
        warmth_material_values_by_name = _extract_numeric_values_by_name(
            data.get("materials"),
            candidate_fields=("warmthValue", "warmIndexValue", "warmth", "value"),
        )

    warmth_season_values_by_name = None
    if "seasons" in data:
        warmth_season_values_by_name = _extract_numeric_values_by_name(
            data.get("seasons"),
            candidate_fields=("warmthValue", "warmIndexValue", "warmth", "value"),
        )

    SETTINGS.update_classifier_labels(
        category_labels=category_labels,
        color_labels=color_labels,
        style_labels=style_labels,
        brand_labels=brand_labels,
        category_label_ids_by_name=category_label_ids_by_name,
        color_label_ids_by_name=color_label_ids_by_name,
        style_label_ids_by_name=style_label_ids_by_name,
        brand_label_ids_by_name=brand_label_ids_by_name,
        warmth_category_values_by_name=warmth_category_values_by_name,
        warmth_color_modifiers_by_name=warmth_color_modifiers_by_name,
        warmth_material_values_by_name=warmth_material_values_by_name,
        warmth_season_values_by_name=warmth_season_values_by_name,
    )

    LOGGER.info(
        "Garment labels synced | categories=%s colors=%s styles=%s brands=%s warmth(category,color,material,season)=(%s,%s,%s,%s)",
        len(SETTINGS.category_labels),
        len(SETTINGS.color_labels),
        len(SETTINGS.style_labels),
        len(SETTINGS.brand_labels),
        len(SETTINGS.warmth_category_values_by_name),
        len(SETTINGS.warmth_color_modifiers_by_name),
        len(SETTINGS.warmth_material_values_by_name),
        len(SETTINGS.warmth_season_values_by_name),
    )


def _extract_label_catalog(values: Any) -> tuple[tuple[str, ...], dict[str, str]]:
    if not isinstance(values, list):
        return tuple(), {}

    names: list[str] = []
    ids_by_name: dict[str, str] = {}
    seen: set[str] = set()
    for value in values:
        if not isinstance(value, dict):
            continue

        name = value.get("name")
        if not isinstance(name, str):
            continue

        normalized = name.strip()
        if not normalized:
            continue

        dedupe_key = normalized.lower()
        if dedupe_key in seen:
            continue

        label_id = value.get("id")
        if not isinstance(label_id, str):
            continue

        normalized_id = label_id.strip()
        if not normalized_id:
            continue

        seen.add(dedupe_key)
        names.append(normalized)
        ids_by_name[_normalize_label_key(normalized)] = normalized_id

    return tuple(names), ids_by_name


def _extract_numeric_values_by_name(values: Any, *, candidate_fields: tuple[str, ...]) -> dict[str, float]:
    if not isinstance(values, list):
        return {}

    numeric_by_name: dict[str, float] = {}
    for value in values:
        if not isinstance(value, dict):
            continue

        name = value.get("name")
        if not isinstance(name, str):
            continue

        normalized_name = _normalize_label_key(name)
        if not normalized_name:
            continue

        parsed_value: float | None = None
        for field_name in candidate_fields:
            raw_value = value.get(field_name)
            if isinstance(raw_value, (int, float)):
                parsed_value = float(raw_value)
                break

        if parsed_value is None:
            continue

        numeric_by_name[normalized_name] = parsed_value

    return numeric_by_name