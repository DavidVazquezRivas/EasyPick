from __future__ import annotations

from dataclasses import dataclass

from app.domain.exceptions import DetectionFailure
from app.exceptions import (
    BackgroundRemovalError,
    ClipClassificationError,
    DetectionError,
    InvalidInputError,
)


@dataclass(frozen=True)
class HttpError:
    status_code: int
    detail: str


def map_exception_to_http_error(exc: Exception) -> HttpError:
    if isinstance(exc, (InvalidInputError,)):
        return HttpError(status_code=400, detail=str(exc))

    if isinstance(exc, (DetectionFailure, DetectionError, BackgroundRemovalError, ClipClassificationError)):
        return HttpError(status_code=422, detail=str(exc))

    return HttpError(status_code=500, detail="Processing failed")