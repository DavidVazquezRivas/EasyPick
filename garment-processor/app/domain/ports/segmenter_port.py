from __future__ import annotations

from typing import Protocol

from PIL import Image

from app.domain.models.candidate import Candidate


class SegmenterPort(Protocol):
    def segment(self, image: Image.Image) -> list[Candidate]:
        ...