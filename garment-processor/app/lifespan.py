from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from transformers import CLIPModel, CLIPProcessor
from ultralytics import YOLO

from app.config import SETTINGS
from app.pipeline import GarmentProcessingPipeline
from app.services.background_service import BackgroundRemover
from app.services.clip_service import ClipTagger
from app.services.yolo_service import YoloGarmentDetector


@asynccontextmanager
async def app_lifespan(application: FastAPI):
    yolo_model = YOLO(SETTINGS.yolo_model_name)
    clip_model = CLIPModel.from_pretrained(SETTINGS.clip_model_name)
    clip_model.eval()
    clip_processor = CLIPProcessor.from_pretrained(SETTINGS.clip_model_name)

    application.state.pipeline = GarmentProcessingPipeline(
        detector=YoloGarmentDetector(yolo_model),
        background_remover=BackgroundRemover(),
        clip_tagger=ClipTagger(model=clip_model, processor=clip_processor),
    )
    yield
