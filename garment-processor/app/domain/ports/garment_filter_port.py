from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from PIL import Image


@dataclass(frozen=True)
class GarmentFilterDecision:
    is_garment: bool
    garment_score: float
    non_garment_score: float


class GarmentFilterPort(Protocol):
    def is_garment(self, image: Image.Image) -> GarmentFilterDecision:
        ...