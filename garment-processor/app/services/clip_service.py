from __future__ import annotations

from dataclasses import dataclass

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

from app.config import (
    SETTINGS,
    CATEGORY_LABELS,
    COLOR_LABELS,
    MATERIAL_LABELS,
    SEASON_LABELS,
    STYLE_LABELS,
)
from app.exceptions import ClipClassificationError


@dataclass
class ClipResult:
    label: str
    score: float


class ClipTagger:
    def __init__(self, model: CLIPModel, processor: CLIPProcessor) -> None:
        self._model = model
        self._processor = processor

    def classify(self, image: Image.Image) -> dict[str, ClipResult]:
        rgb_image = image if image.mode == "RGB" else image.convert("RGB")
        return {
            "category": self._infer_dimension(rgb_image, CATEGORY_LABELS, "a photo of a {label} garment"),
            "color": self._infer_dimension(rgb_image, COLOR_LABELS, "a {label} colored garment"),
            "style": self._infer_dimension(rgb_image, STYLE_LABELS, "a {label} style outfit"),
            "material": self._infer_dimension(rgb_image, MATERIAL_LABELS, "a garment made of {label}"),
            "season": self._infer_dimension(rgb_image, SEASON_LABELS, "a garment for {label}"),
        }

    def _infer_dimension(self, image: Image.Image, labels: tuple[str, ...], prompt_template: str) -> ClipResult:
        prompts = [prompt_template.format(label=label) for label in labels]
        try:
            inputs = self._processor(text=prompts, images=image, return_tensors="pt", padding=True)
            
            # Move inputs to same device as model
            device = next(self._model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self._model(**inputs)
                logits = outputs.logits_per_image
                probs = torch.softmax(logits, dim=1)[0]

            best_index = int(torch.argmax(probs).item())
            best_score = float(probs[best_index].item())

            if best_score < SETTINGS.clip_min_confidence:
                raise ClipClassificationError(
                    f"Low CLIP confidence ({best_score:.3f}) for dimension inference"
                )

            return ClipResult(label=labels[best_index], score=best_score)
        except ClipClassificationError:
            raise
        except Exception as exc:
            raise ClipClassificationError("CLIP classification failed") from exc
