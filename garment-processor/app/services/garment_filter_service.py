from __future__ import annotations

from dataclasses import dataclass

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

from app.config import (
    GARMENT_FILTER_NEGATIVE_PROMPTS,
    GARMENT_FILTER_POSITIVE_PROMPTS,
    SETTINGS,
)


@dataclass(frozen=True)
class GarmentFilterDecision:
    is_garment: bool
    garment_score: float
    non_garment_score: float


class ClipGarmentFilter:
    def __init__(self, model: CLIPModel, processor: CLIPProcessor) -> None:
        self._model = model
        self._processor = processor

    def is_garment(self, image: Image.Image) -> GarmentFilterDecision:
        rgb_image = image if image.mode == "RGB" else image.convert("RGB")
        prompts = [*GARMENT_FILTER_POSITIVE_PROMPTS, *GARMENT_FILTER_NEGATIVE_PROMPTS]
        split_index = len(GARMENT_FILTER_POSITIVE_PROMPTS)

        inputs = self._processor(text=prompts, images=rgb_image, return_tensors="pt", padding=True)
        
        device = next(self._model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self._model(**inputs)
            probs = torch.softmax(outputs.logits_per_image, dim=1)[0]

        garment_score = float(torch.sum(probs[:split_index]).item())
        non_garment_score = float(torch.sum(probs[split_index:]).item())

        is_garment = (
            garment_score >= SETTINGS.garment_filter_min_score
            and garment_score >= non_garment_score + SETTINGS.garment_filter_margin
        )

        return GarmentFilterDecision(
            is_garment=is_garment,
            garment_score=garment_score,
            non_garment_score=non_garment_score,
        )
