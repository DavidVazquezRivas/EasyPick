from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LabelPrediction:
    label: str
    score: float