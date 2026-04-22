from __future__ import annotations

from app.adapters.http.error_mapper import map_exception_to_http_error
from app.domain.exceptions import DetectionFailure
from app.exceptions import InvalidInputError


def test_mapper_maps_invalid_input_to_400() -> None:
    mapped = map_exception_to_http_error(InvalidInputError("bad image"))
    assert mapped.status_code == 400
    assert mapped.detail == "bad image"


def test_mapper_maps_detection_failure_to_422() -> None:
    mapped = map_exception_to_http_error(DetectionFailure("dino failed"))
    assert mapped.status_code == 422
    assert mapped.detail == "dino failed"


def test_mapper_maps_unexpected_errors_to_500() -> None:
    mapped = map_exception_to_http_error(RuntimeError("boom"))
    assert mapped.status_code == 500
    assert mapped.detail == "Processing failed"