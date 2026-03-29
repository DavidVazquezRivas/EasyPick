from __future__ import annotations

from pydantic import BaseModel

from app.models.label_score import LabelScore


class GarmentLabels(BaseModel):
    category: LabelScore
    color: LabelScore
    style: LabelScore
    material: LabelScore
    season: LabelScore
