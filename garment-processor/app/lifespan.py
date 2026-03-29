from __future__ import annotations

from contextlib import asynccontextmanager
import logging

import torch
from fastapi import FastAPI
from transformers import CLIPModel, CLIPProcessor
from ultralytics import YOLO

from app.config import SETTINGS
from app.processing import GarmentProcessingOrchestrator, ProcessedGarmentResponseBuilder
from app.services.background_service import BackgroundRemover
from app.services.clip_service import ClipTagger
from app.services.garment_filter_service import ClipGarmentFilter
from app.services.segmentation_service import SamSegmentationService
from app.services.yolo_service import YoloGarmentDetector

LOGGER = logging.getLogger(__name__)


@asynccontextmanager
async def app_lifespan(application: FastAPI):
    # Determine device
    if SETTINGS.use_gpu and torch.cuda.is_available():
        device = "cuda"
        LOGGER.info("GPU available and enabled. Using CUDA.")
    else:
        device = "cpu"
        if SETTINGS.use_gpu and not torch.cuda.is_available():
            LOGGER.warning("GPU enabled but not available. Falling back to CPU.")
        else:
            LOGGER.info("Using CPU (GPU disabled in settings)")
    
    LOGGER.info(f"Loading YOLO and CLIP models on device: {device}")
    yolo_model = YOLO(SETTINGS.yolo_model_name)
    if device == "cuda":
        yolo_model.to(device)
    
    clip_model = CLIPModel.from_pretrained(SETTINGS.clip_model_name)
    clip_model = clip_model.to(device)
    clip_model.eval()
    clip_processor = CLIPProcessor.from_pretrained(SETTINGS.clip_model_name)

    segmenter = None
    if SETTINGS.segmentation_enabled:
        try:
            segmenter = SamSegmentationService.create_default()
            if device == "cuda":
                segmenter._processor.model.to(device)
            LOGGER.info(f"SAM segmentation model initialized on {device}")
        except Exception as exc:
            segmenter = None
            LOGGER.warning("SAM initialization failed; YOLO fallback will be used: %s", exc)

    application.state.orchestrator = GarmentProcessingOrchestrator(
        detector=YoloGarmentDetector(yolo_model),
        background_remover=BackgroundRemover(),
        clip_tagger=ClipTagger(model=clip_model, processor=clip_processor),
        garment_filter=ClipGarmentFilter(model=clip_model, processor=clip_processor),
        segmenter=segmenter,
    )
    application.state.response_builder = ProcessedGarmentResponseBuilder()
    LOGGER.info("Models loaded and processing components initialized")
    yield
