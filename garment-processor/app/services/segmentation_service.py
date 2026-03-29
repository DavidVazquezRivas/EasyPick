from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from PIL import Image
from transformers import pipeline

from app.config import SETTINGS


@dataclass(frozen=True)
class SegmentedCandidate:
    image: Image.Image
    confidence: float
    bbox: tuple[int, int, int, int]
    area_px: int


class SamSegmentationService:
    def __init__(self, mask_pipeline) -> None:
        self._mask_pipeline = mask_pipeline

    @staticmethod
    def create_default() -> "SamSegmentationService":
        mask_pipeline = pipeline(
            task="mask-generation",
            model=SETTINGS.segmentation_model_name,
        )
        return SamSegmentationService(mask_pipeline)

    def segment(self, image: Image.Image) -> list[SegmentedCandidate]:
        output = self._mask_pipeline(image)
        masks = output.get("masks", []) if isinstance(output, dict) else []
        scores = output.get("scores", []) if isinstance(output, dict) else []

        if not masks:
            return []

        image_width, image_height = image.size
        image_area = image_width * image_height
        max_area_px = int(image_area * SETTINGS.segmentation_max_mask_area_ratio)

        candidates: list[SegmentedCandidate] = []
        limit = min(len(masks), SETTINGS.segmentation_top_k_masks)

        for idx in range(limit):
            mask_tensor = masks[idx]
            mask_np = mask_tensor.detach().cpu().numpy().astype(np.uint8)

            ys, xs = np.where(mask_np > 0)
            if ys.size == 0 or xs.size == 0:
                continue

            area_px = int(mask_np.sum())
            if area_px < SETTINGS.segmentation_min_mask_area_px:
                continue
            if area_px > max_area_px:
                continue

            left = int(xs.min())
            right = int(xs.max())
            top = int(ys.min())
            bottom = int(ys.max())

            if right <= left or bottom <= top:
                continue

            bbox_area = max(1, (right - left + 1) * (bottom - top + 1))
            bbox_area_ratio = bbox_area / float(image_area)
            mask_fill_ratio = area_px / float(bbox_area)
            if bbox_area_ratio > SETTINGS.segmentation_max_bbox_area_ratio:
                continue
            if mask_fill_ratio < SETTINGS.segmentation_min_mask_fill_ratio:
                continue

            crop_rgba = image.crop((left, top, right + 1, bottom + 1)).convert("RGBA")
            alpha_np = (mask_np[top : bottom + 1, left : right + 1] * 255).astype(np.uint8)
            alpha_mask = Image.fromarray(alpha_np, mode="L")
            crop_rgba.putalpha(alpha_mask)

            score = float(scores[idx].item()) if len(scores) > idx else 0.0
            candidates.append(
                SegmentedCandidate(
                    image=crop_rgba,
                    confidence=score,
                    bbox=(left, top, right, bottom),
                    area_px=area_px,
                )
            )

        return self._deduplicate(candidates)

    def _deduplicate(self, candidates: list[SegmentedCandidate]) -> list[SegmentedCandidate]:
        if not candidates:
            return []

        sorted_candidates = sorted(candidates, key=lambda item: item.confidence, reverse=True)
        accepted: list[SegmentedCandidate] = []

        for candidate in sorted_candidates:
            overlaps = any(
                self._bbox_iou(candidate.bbox, existing.bbox)
                >= SETTINGS.segmentation_bbox_iou_dedup_threshold
                for existing in accepted
            )
            if overlaps:
                continue

            is_contained = False
            for existing in accepted:
                containment = self._containment_ratio(candidate.bbox, existing.bbox)
                if (
                    containment >= SETTINGS.segmentation_containment_threshold
                    and candidate.area_px < int(existing.area_px * 0.75)
                ):
                    is_contained = True
                    break

            if not is_contained:
                accepted.append(candidate)

        accepted.sort(key=lambda item: item.area_px, reverse=True)
        pruned: list[SegmentedCandidate] = []

        for candidate in accepted:
            inside_larger = False
            for larger in pruned:
                containment = self._containment_ratio(candidate.bbox, larger.bbox)
                if (
                    containment >= SETTINGS.segmentation_containment_threshold
                    and candidate.area_px < int(larger.area_px * 0.75)
                ):
                    inside_larger = True
                    break

            if not inside_larger:
                pruned.append(candidate)

        return sorted(pruned, key=lambda item: item.confidence, reverse=True)

    @staticmethod
    def _bbox_iou(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> float:
        inter_area = SamSegmentationService._intersection_area(a, b)
        if inter_area <= 0:
            return 0.0

        ax1, ay1, ax2, ay2 = a
        bx1, by1, bx2, by2 = b
        a_area = max(1, (ax2 - ax1 + 1) * (ay2 - ay1 + 1))
        b_area = max(1, (bx2 - bx1 + 1) * (by2 - by1 + 1))

        return inter_area / float(a_area + b_area - inter_area)

    @staticmethod
    def _containment_ratio(inner: tuple[int, int, int, int], outer: tuple[int, int, int, int]) -> float:
        inter_area = SamSegmentationService._intersection_area(inner, outer)
        if inter_area <= 0:
            return 0.0

        ix1, iy1, ix2, iy2 = inner
        inner_area = max(1, (ix2 - ix1 + 1) * (iy2 - iy1 + 1))
        return inter_area / float(inner_area)

    @staticmethod
    def _intersection_area(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> int:
        ax1, ay1, ax2, ay2 = a
        bx1, by1, bx2, by2 = b

        inter_left = max(ax1, bx1)
        inter_top = max(ay1, by1)
        inter_right = min(ax2, bx2)
        inter_bottom = min(ay2, by2)

        if inter_right < inter_left or inter_bottom < inter_top:
            return 0

        return (inter_right - inter_left + 1) * (inter_bottom - inter_top + 1)
