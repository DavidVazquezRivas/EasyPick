"""Profile stage timings for the DINO-only pipeline on a reference image."""
from __future__ import annotations

import logging
import time
from pathlib import Path

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

from app.config import SETTINGS
from app.services.background_service import BackgroundRemover
from app.services.clip_service import ClipTagger
from app.services.garment_filter_service import ClipGarmentFilter
from app.services.grounding_dino_segmentation_service import GroundingDinoSegmentationService

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
IMAGE_PATH = ROOT / "example2.jpg"


def main() -> None:
    device = "cuda" if (SETTINGS.use_gpu and torch.cuda.is_available()) else "cpu"
    LOGGER.info("Using device: %s", device)

    if not IMAGE_PATH.exists():
        raise FileNotFoundError(f"Reference image not found: {IMAGE_PATH}")

    original_image = Image.open(IMAGE_PATH).convert("RGB")
    LOGGER.info("Loaded image %s size=%s", IMAGE_PATH.name, original_image.size)

    timings: dict[str, float] = {}

    # 1) Grounding DINO candidate extraction
    segmenter = GroundingDinoSegmentationService.create_default()
    if device == "cuda":
        segmenter.to_device(device)
    t0 = time.perf_counter()
    candidates = segmenter.segment(original_image)
    t1 = time.perf_counter()
    timings["dino_detection"] = t1 - t0
    LOGGER.info("Candidates from DINO: %s", len(candidates))

    # 2) Garment filter on crops
    clip_model = CLIPModel.from_pretrained(SETTINGS.clip_model_name)
    clip_model = clip_model.to(device)
    clip_model.eval()
    clip_processor = CLIPProcessor.from_pretrained(SETTINGS.clip_model_name)
    garment_filter = ClipGarmentFilter(model=clip_model, processor=clip_processor)

    t2 = time.perf_counter()
    accepted = []
    for candidate in candidates:
        decision = garment_filter.is_garment(candidate.image)
        if not SETTINGS.garment_filter_enabled or decision.is_garment:
            accepted.append(candidate)
    t3 = time.perf_counter()
    timings["garment_filter"] = t3 - t2
    LOGGER.info("Candidates after garment filter: %s", len(accepted))

    # 3) Background removal + 4) CLIP attribute classification
    bg_remover = BackgroundRemover()
    clip_tagger = ClipTagger(model=clip_model, processor=clip_processor)

    t_bg = 0.0
    t_clip = 0.0
    for candidate in accepted:
        b0 = time.perf_counter()
        no_bg = bg_remover.remove_background(candidate.image)
        b1 = time.perf_counter()
        t_bg += b1 - b0

        c0 = time.perf_counter()
        _ = clip_tagger.classify(no_bg)
        c1 = time.perf_counter()
        t_clip += c1 - c0

    timings["background_removal"] = t_bg
    timings["clip_classification"] = t_clip

    total = sum(timings.values())
    LOGGER.info("Timing summary:")
    for stage, elapsed in sorted(timings.items(), key=lambda item: item[1], reverse=True):
        ratio = (elapsed / total * 100.0) if total else 0.0
        LOGGER.info("  %s: %.3fs (%.1f%%)", stage, elapsed, ratio)
    LOGGER.info("  total: %.3fs", total)


if __name__ == "__main__":
    main()