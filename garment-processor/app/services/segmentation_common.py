from __future__ import annotations

from dataclasses import dataclass

from PIL import Image


@dataclass(frozen=True)
class SegmentedCandidate:
    image: Image.Image
    confidence: float
    bbox: tuple[int, int, int, int]
    area_px: int


@dataclass(frozen=True)
class SegmentationStageMetrics:
    raw_masks: int
    top_k_limit: int
    passed_area: int
    passed_bbox_and_fill: int
    pre_dedup_candidates: int
    post_dedup_candidates: int
    inference_seconds: float
    postprocess_seconds: float
    dedup_seconds: float
    total_seconds: float


class SegmentationGeometryMixin:
    @staticmethod
    def _bbox_iou(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> float:
        inter_area = SegmentationGeometryMixin._intersection_area(a, b)
        if inter_area <= 0:
            return 0.0

        ax1, ay1, ax2, ay2 = a
        bx1, by1, bx2, by2 = b
        a_area = max(1, (ax2 - ax1 + 1) * (ay2 - ay1 + 1))
        b_area = max(1, (bx2 - bx1 + 1) * (by2 - by1 + 1))

        return inter_area / float(a_area + b_area - inter_area)

    @staticmethod
    def _containment_ratio(inner: tuple[int, int, int, int], outer: tuple[int, int, int, int]) -> float:
        inter_area = SegmentationGeometryMixin._intersection_area(inner, outer)
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