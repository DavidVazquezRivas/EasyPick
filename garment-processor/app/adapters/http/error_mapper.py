from __future__ import annotations

from dataclasses import dataclass

from starlette import status

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
        return HttpError(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    if isinstance(exc, (DetectionFailure, DetectionError, BackgroundRemovalError, ClipClassificationError)):
        return HttpError(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(exc))

    return HttpError(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Processing failed")
