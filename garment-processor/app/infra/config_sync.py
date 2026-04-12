from __future__ import annotations

import json
import logging
from typing import Any
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request

from app.config import SETTINGS

LOGGER = logging.getLogger(__name__)


def sync_garment_labels_from_main_api() -> None:
    if not SETTINGS.sync_garment_labels_on_startup:
        LOGGER.info("Garment label sync disabled by configuration")
        return

    url = urllib_parse.urljoin(
        SETTINGS.api_base_url.rstrip("/") + "/",
        SETTINGS.garment_config_endpoint.lstrip("/"),
    )
    request = urllib_request.Request(url, headers={"Accept": "application/json"}, method="GET")

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

    category_labels = _extract_names(data.get("categories"))
    color_labels = _extract_names(data.get("colors"))
    style_labels = _extract_names(data.get("styles"))
    brand_labels = _extract_names(data.get("brands"))

    SETTINGS.update_classifier_labels(
        category_labels=category_labels,
        color_labels=color_labels,
        style_labels=style_labels,
        brand_labels=brand_labels,
    )

    LOGGER.info(
        "Garment labels synced | categories=%s colors=%s styles=%s brands=%s",
        len(SETTINGS.category_labels),
        len(SETTINGS.color_labels),
        len(SETTINGS.style_labels),
        len(SETTINGS.brand_labels),
    )


def _extract_names(values: Any) -> tuple[str, ...]:
    if not isinstance(values, list):
        return tuple()

    names: list[str] = []
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

        seen.add(dedupe_key)
        names.append(normalized)

    return tuple(names)