from __future__ import annotations

import json

from app.config import SETTINGS
from app.infra.config_sync import _extract_label_catalog, sync_garment_labels_from_main_api


class _FakeResponse:
    def __init__(self, payload: dict[str, object], status_code: int = 200) -> None:
        self._payload = payload
        self._status_code = status_code

    def getcode(self) -> int:
        return self._status_code

    def read(self) -> bytes:
        return json.dumps(self._payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        return False


def test_extract_label_catalog_returns_names_and_ids() -> None:
    raw_values = [
        {"id": "id-blue", "name": "  Blue "},
        {"id": "id-duplicate", "name": "blue"},
        {"id": "id-black", "name": "Black"},
        {"id": "", "name": "Red"},
        {"name": " "},
        {"other": "missing"},
        "invalid",
    ]

    labels, ids_by_name = _extract_label_catalog(raw_values)

    assert labels == ("Blue", "Black")
    assert ids_by_name == {"blue": "id-blue", "black": "id-black"}


def test_sync_garment_labels_updates_settings_from_api(monkeypatch) -> None:
    original = (
        SETTINGS.category_labels,
        SETTINGS.color_labels,
        SETTINGS.style_labels,
        SETTINGS.brand_labels,
        SETTINGS.category_label_ids_by_name,
        SETTINGS.color_label_ids_by_name,
        SETTINGS.style_label_ids_by_name,
        SETTINGS.brand_label_ids_by_name,
        SETTINGS.warmth_category_values_by_name,
        SETTINGS.warmth_color_modifiers_by_name,
        SETTINGS.warmth_material_values_by_name,
        SETTINGS.warmth_season_values_by_name,
    )

    def _fake_urlopen(request, timeout=0):
        payload = {
            "success": True,
            "data": {
                "categories": [{"id": "cat-1", "name": "camiseta"}, {"id": "cat-2", "name": "pantalon"}],
                "colors": [{"id": "color-1", "name": "azul"}],
                "styles": [{"id": "style-1", "name": "casual"}, {"id": "style-2", "name": "urbano"}],
                "brands": [{"id": "brand-1", "name": "Zara"}, {"id": "brand-2", "name": "Nike"}],
                "materials": [{"id": "mat-1", "name": "wool", "warmthValue": 9}],
                "seasons": [{"id": "sea-1", "name": "winter", "warmthValue": 10}],
            },
        }
        return _FakeResponse(payload, status_code=200)

    monkeypatch.setattr(
        "app.infra.config_sync.build_main_api_auth_headers",
        lambda: {"Accept": "application/json", "Authorization": "Bearer test-jwt"},
    )
    monkeypatch.setattr("app.infra.config_sync.urllib_request.urlopen", _fake_urlopen)

    try:
        sync_garment_labels_from_main_api()

        assert SETTINGS.category_labels == ("camiseta", "pantalon")
        assert SETTINGS.color_labels == ("azul",)
        assert SETTINGS.style_labels == ("casual", "urbano")
        assert SETTINGS.brand_labels == ("Zara", "Nike")
        assert SETTINGS.category_label_ids_by_name == {"camiseta": "cat-1", "pantalon": "cat-2"}
        assert SETTINGS.color_label_ids_by_name == {"azul": "color-1"}
        assert SETTINGS.style_label_ids_by_name == {"casual": "style-1", "urbano": "style-2"}
        assert SETTINGS.brand_label_ids_by_name == {"zara": "brand-1", "nike": "brand-2"}
        assert SETTINGS.warmth_category_values_by_name == {}
        assert SETTINGS.warmth_color_modifiers_by_name == {}
        assert SETTINGS.warmth_material_values_by_name == {"wool": 9.0}
        assert SETTINGS.warmth_season_values_by_name == {"winter": 10.0}
    finally:
        SETTINGS.update_classifier_labels(
            category_labels=original[0],
            color_labels=original[1],
            style_labels=original[2],
            brand_labels=original[3],
            category_label_ids_by_name=original[4],
            color_label_ids_by_name=original[5],
            style_label_ids_by_name=original[6],
            brand_label_ids_by_name=original[7],
            warmth_category_values_by_name=original[8],
            warmth_color_modifiers_by_name=original[9],
            warmth_material_values_by_name=original[10],
            warmth_season_values_by_name=original[11],
        )


def test_sync_garment_labels_does_not_crash_when_api_fails(monkeypatch) -> None:
    original = (
        SETTINGS.category_labels,
        SETTINGS.color_labels,
        SETTINGS.style_labels,
        SETTINGS.brand_labels,
        SETTINGS.category_label_ids_by_name,
        SETTINGS.color_label_ids_by_name,
        SETTINGS.style_label_ids_by_name,
        SETTINGS.brand_label_ids_by_name,
        SETTINGS.warmth_category_values_by_name,
        SETTINGS.warmth_color_modifiers_by_name,
        SETTINGS.warmth_material_values_by_name,
        SETTINGS.warmth_season_values_by_name,
    )

    def _fake_urlopen(request, timeout=0):
        raise RuntimeError("network error")

    monkeypatch.setattr(
        "app.infra.config_sync.build_main_api_auth_headers",
        lambda: {"Accept": "application/json"},
    )
    monkeypatch.setattr("app.infra.config_sync.urllib_request.urlopen", _fake_urlopen)

    sync_garment_labels_from_main_api()

    assert SETTINGS.category_labels == original[0]
    assert SETTINGS.color_labels == original[1]
    assert SETTINGS.style_labels == original[2]
    assert SETTINGS.brand_labels == original[3]
    assert SETTINGS.category_label_ids_by_name == original[4]
    assert SETTINGS.color_label_ids_by_name == original[5]
    assert SETTINGS.style_label_ids_by_name == original[6]
    assert SETTINGS.brand_label_ids_by_name == original[7]
    assert SETTINGS.warmth_category_values_by_name == original[8]
    assert SETTINGS.warmth_color_modifiers_by_name == original[9]
    assert SETTINGS.warmth_material_values_by_name == original[10]
    assert SETTINGS.warmth_season_values_by_name == original[11]
