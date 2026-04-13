from __future__ import annotations

from dataclasses import dataclass

from PIL import Image


@dataclass(frozen=True)
class Candidate:
    image: Image.Image
    confidence: float
    bbox: tuple[int, int, int, int]
    area_px: int