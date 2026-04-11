from __future__ import annotations

import logging
import time

from PIL import Image

from app.config import SETTINGS
from app.domain.exceptions import DetectionFailure
from app.domain.models.garment import Garment
from app.domain.models.label_prediction import LabelPrediction
from app.domain.ports.background_remover_port import BackgroundRemoverPort
from app.domain.ports.classifier_port import ClassifierPort
from app.domain.ports.garment_filter_port import GarmentFilterPort
from app.domain.ports.segmenter_port import SegmenterPort
from app.exceptions import BackgroundRemovalError, ClipClassificationError
from app.utils.request_context import get_request_id

LOGGER = logging.getLogger(__name__)


def _default_classifier_labels() -> dict[str, LabelPrediction]:
    def _first_or_unknown(values: tuple[str, ...]) -> LabelPrediction:
        return LabelPrediction(label=values[0] if values else "unknown", score=0.0)

    return {
        "category": _first_or_unknown(SETTINGS.category_labels),
        "color": _first_or_unknown(SETTINGS.color_labels),
        "style": _first_or_unknown(SETTINGS.style_labels),
        "material": _first_or_unknown(SETTINGS.material_labels),
        "season": _first_or_unknown(SETTINGS.season_labels),
        "brand": _first_or_unknown(SETTINGS.brand_labels),
    }


class ProcessGarmentsUseCase:
    def __init__(
        self,
        segmenter: SegmenterPort,
        garment_filter: GarmentFilterPort,
        background_remover: BackgroundRemoverPort,
        classifier: ClassifierPort,
    ) -> None:
        self._segmenter = segmenter
        self._garment_filter = garment_filter
        self._background_remover = background_remover
        self._classifier = classifier

    def execute(self, image: Image.Image) -> list[Garment]:
        request_id = get_request_id()
        t0 = time.perf_counter()

        try:
            candidates = self._segmenter.segment(image)
        except Exception as exc:
            raise DetectionFailure("Candidate detection failed") from exc

        garments: list[Garment] = []
        filter_time = 0.0
        bg_time = 0.0
        clip_time = 0.0
        discarded_by_filter = 0
        passed_filter = 0
        passed_background = 0
        passed_clip = 0
        failed_background = 0
        failed_clip = 0

        for candidate in candidates:
            t_f0 = time.perf_counter()
            decision = self._garment_filter.is_garment(candidate.image)
            t_f1 = time.perf_counter()
            filter_time += t_f1 - t_f0
            if SETTINGS.garment_filter_enabled and not decision.is_garment:
                discarded_by_filter += 1
                continue
            passed_filter += 1

            t_b0 = time.perf_counter()
            try:
                image_no_bg = self._background_remover.remove_background(candidate.image)
            except BackgroundRemovalError:
                failed_background += 1
                continue
            t_b1 = time.perf_counter()
            bg_time += t_b1 - t_b0
            passed_background += 1

            t_c0 = time.perf_counter()
            try:
                labels = self._classifier.classify(image_no_bg)
            except ClipClassificationError:
                failed_clip += 1
                labels = _default_classifier_labels()
            t_c1 = time.perf_counter()
            clip_time += t_c1 - t_c0
            passed_clip += 1

            garments.append(
                Garment(
                    image=image_no_bg,
                    detection_confidence=candidate.confidence,
                    labels=labels,
                )
            )

        t1 = time.perf_counter()
        if SETTINGS.pipeline_log_stage_metrics:
            LOGGER.info(
                "Use case metrics | request_id=%s candidates=%s discarded=%s garments=%s "
                "t_filter=%.3fs t_bg=%.3fs t_clip=%.3fs t_total=%.3fs",
                request_id,
                len(candidates),
                discarded_by_filter,
                len(garments),
                filter_time,
                bg_time,
                clip_time,
                t1 - t0,
            )

        if candidates and not garments:
            LOGGER.warning(
                "Use case produced no garments from existing candidates | request_id=%s backend=%s candidates=%s "
                "passed_filter=%s passed_bg=%s passed_clip=%s failed_bg=%s failed_clip=%s discarded_filter=%s",
                request_id,
                SETTINGS.segmentation_backend,
                len(candidates),
                passed_filter,
                passed_background,
                passed_clip,
                failed_background,
                failed_clip,
                discarded_by_filter,
            )
        elif not candidates:
            LOGGER.warning(
                "Use case had zero candidates before garment stages | request_id=%s backend=%s",
                request_id,
                SETTINGS.segmentation_backend,
            )

        return garments
