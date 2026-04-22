from __future__ import annotations

import json

from app.config import SETTINGS
from app.infra.config_sync import _extract_names, sync_garment_labels_from_main_api


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


def test_extract_names_returns_deduped_and_stripped_names() -> None:
    raw_values = [
        {"name": "  Blue "},
        {"name": "blue"},
        {"name": "Black"},
        {"name": " "},
        {"other": "missing"},
        "invalid",
    ]

    labels = _extract_names(raw_values)

    assert labels == ("Blue", "Black")


def test_sync_garment_labels_updates_settings_from_api(monkeypatch) -> None:
    original = (
        SETTINGS.category_labels,
        SETTINGS.color_labels,
        SETTINGS.style_labels,
        SETTINGS.brand_labels,
    )

    def _fake_urlopen(request, timeout=0):
        payload = {
            "success": True,
            "data": {
                "categories": [{"name": "camiseta"}, {"name": "pantalon"}],
                "colors": [{"name": "azul"}],
                "styles": [{"name": "casual"}, {"name": "urbano"}],
                "brands": [{"name": "Zara"}, {"name": "Nike"}],
            },
        }
        return _FakeResponse(payload, status_code=200)

    monkeypatch.setattr("app.infra.config_sync.urllib_request.urlopen", _fake_urlopen)

    try:
        sync_garment_labels_from_main_api()

        assert SETTINGS.category_labels == ("camiseta", "pantalon")
        assert SETTINGS.color_labels == ("azul",)
        assert SETTINGS.style_labels == ("casual", "urbano")
        assert SETTINGS.brand_labels == ("Zara", "Nike")
    finally:
        SETTINGS.update_classifier_labels(
            category_labels=original[0],
            color_labels=original[1],
            style_labels=original[2],
            brand_labels=original[3],
        )


def test_sync_garment_labels_does_not_crash_when_api_fails(monkeypatch) -> None:
    original = (
        SETTINGS.category_labels,
        SETTINGS.color_labels,
        SETTINGS.style_labels,
        SETTINGS.brand_labels,
    )

    def _fake_urlopen(request, timeout=0):
        raise RuntimeError("network error")

    monkeypatch.setattr("app.infra.config_sync.urllib_request.urlopen", _fake_urlopen)

    sync_garment_labels_from_main_api()

    assert SETTINGS.category_labels == original[0]
    assert SETTINGS.color_labels == original[1]
    assert SETTINGS.style_labels == original[2]
    assert SETTINGS.brand_labels == original[3]
