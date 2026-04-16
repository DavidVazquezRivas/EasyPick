from __future__ import annotations

import logging
import time
from typing import Any, Iterable, cast

import torch
from PIL import Image
from transformers import AutoModelForZeroShotObjectDetection, AutoProcessor

from app.config import SETTINGS
from app.services.segmentation_common import (
    SegmentationGeometryMixin,
    SegmentationStageMetrics,
    SegmentedCandidate,
)

LOGGER = logging.getLogger(__name__)


class GroundingDinoSegmentationService(SegmentationGeometryMixin):
    def __init__(self, processor: Any, model: Any) -> None:
        self._processor = processor
        self._model = model

    @staticmethod
    def create_default() -> "GroundingDinoSegmentationService":
        processor = AutoProcessor.from_pretrained(SETTINGS.segmentation_dino_model_id)
        model = AutoModelForZeroShotObjectDetection.from_pretrained(SETTINGS.segmentation_dino_model_id)
        model.eval()
        return GroundingDinoSegmentationService(processor=processor, model=model)

    def to_device(self, device: str) -> None:
        self._model.to(device)

    def segment(self, image: Image.Image) -> list[SegmentedCandidate]:
        candidates, _ = self.segment_with_metrics(image)
        return candidates

    def segment_with_metrics(
        self,
        image: Image.Image,
    ) -> tuple[list[SegmentedCandidate], SegmentationStageMetrics]:
        t0 = time.perf_counter()
        inputs = self._processor(
            images=image,
            text=SETTINGS.segmentation_dino_text_prompt,
            return_tensors="pt",
        )

        device = next(self._model.parameters()).device
        inputs = {key: value.to(device) for key, value in inputs.items()}

        with torch.no_grad():
            outputs = self._model(**inputs)

        processed = self._processor.post_process_grounded_object_detection(
            outputs,
            inputs["input_ids"],
            threshold=SETTINGS.segmentation_dino_box_threshold,
            text_threshold=SETTINGS.segmentation_dino_text_threshold,
            target_sizes=[image.size[::-1]],
        )[0]
        t1 = time.perf_counter()

        raw_candidates = self._build_candidates(image, processed)
        filtered_candidates = self._filter_candidates(raw_candidates, image.size)
        t2 = time.perf_counter()

        metrics = SegmentationStageMetrics(
            raw_masks=len(raw_candidates),
            top_k_limit=SETTINGS.segmentation_dino_max_boxes,
            passed_area=len(raw_candidates),
            passed_bbox_and_fill=len(raw_candidates),
            pre_dedup_candidates=len(raw_candidates),
            post_dedup_candidates=len(filtered_candidates),
            inference_seconds=t1 - t0,
            postprocess_seconds=t2 - t1,
            dedup_seconds=0.0,
            total_seconds=t2 - t0,
        )

        if SETTINGS.segmentation_log_stage_metrics:
            LOGGER.info(
                "Grounding DINO metrics | raw=%s post_filter=%s t_infer=%.3fs t_post=%.3fs t_total=%.3fs",
                metrics.pre_dedup_candidates,
                metrics.post_dedup_candidates,
                metrics.inference_seconds,
                metrics.postprocess_seconds,
                metrics.total_seconds,
            )

        return filtered_candidates, metrics

    def _build_candidates(self, image: Image.Image, processed: dict[str, object]) -> list[SegmentedCandidate]:
        width, height = image.size
        boxes = processed.get("boxes", [])
        scores = processed.get("scores", [])

        candidates: list[SegmentedCandidate] = []
        if not hasattr(boxes, "__iter__") or not hasattr(scores, "__iter__"):
            return []

        pairs = zip(cast(Iterable[Any], boxes), cast(Iterable[Any], scores))

        for box, score in pairs:
            x1, y1, x2, y2 = [int(v) for v in box.tolist()]
            x1 = max(0, min(width, x1))
            y1 = max(0, min(height, y1))
            x2 = max(0, min(width, x2))
            y2 = max(0, min(height, y2))
            if x2 <= x1 or y2 <= y1:
                continue

            px1, py1, px2, py2 = self._apply_padding(
                (x1, y1, x2, y2),
                width,
                height,
                SETTINGS.segmentation_dino_bbox_padding_ratio,
            )
            if px2 <= px1 or py2 <= py1:
                continue

            crop = image.crop((px1, py1, px2, py2)).convert("RGBA")
            area_px = max(1, (px2 - px1) * (py2 - py1))
            candidates.append(
                SegmentedCandidate(
                    image=crop,
                    confidence=float(score.item()),
                    bbox=(px1, py1, px2, py2),
                    area_px=area_px,
                )
            )

        return candidates

    def _filter_candidates(
        self,
        candidates: list[SegmentedCandidate],
        image_size: tuple[int, int],
    ) -> list[SegmentedCandidate]:
        sorted_candidates = sorted(candidates, key=lambda item: item.confidence, reverse=True)
        kept: list[SegmentedCandidate] = []
        width, height = image_size
        image_area = max(1, width * height)

        for candidate in sorted_candidates:
            if len(kept) >= SETTINGS.segmentation_dino_max_boxes:
                break

            candidate_area_ratio = candidate.area_px / float(image_area)
            if candidate_area_ratio >= SETTINGS.segmentation_dino_max_generic_clothes_area_ratio:
                continue

            reject = False
            for existing in kept:
                if self._bbox_iou(candidate.bbox, existing.bbox) >= SETTINGS.segmentation_dino_nms_iou_threshold:
                    reject = True
                    break

                containment = self._containment_ratio(candidate.bbox, existing.bbox)
                if containment >= SETTINGS.segmentation_dino_single_box_containment_threshold:
                    reject = True
                    break

            if reject:
                continue

            kept.append(candidate)

        return kept

    @staticmethod
    def _apply_padding(
        bbox: tuple[int, int, int, int],
        width: int,
        height: int,
        padding_ratio: float,
    ) -> tuple[int, int, int, int]:
        x1, y1, x2, y2 = bbox
        bw = max(1, x2 - x1)
        bh = max(1, y2 - y1)
        pad_x = int(round(bw * padding_ratio))
        pad_y = int(round(bh * padding_ratio))

        return (
            max(0, x1 - pad_x),
            max(0, y1 - pad_y),
            min(width, x2 + pad_x),
            min(height, y2 + pad_y),
        )
