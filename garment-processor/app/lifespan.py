from __future__ import annotations

from contextlib import asynccontextmanager
import logging

import torch
from fastapi import FastAPI
from app.config import SETTINGS
from app.infra.bootstrap import build_runtime_components
from app.infra.config_sync import sync_garment_labels_from_main_api

LOGGER = logging.getLogger(__name__)


@asynccontextmanager
async def app_lifespan(application: FastAPI):
    sync_garment_labels_from_main_api()

    if SETTINGS.use_gpu and torch.cuda.is_available():
        device = "cuda"
        LOGGER.info("GPU available and enabled. Using CUDA.")
    else:
        device = "cpu"
        if SETTINGS.use_gpu and not torch.cuda.is_available():
            LOGGER.warning("GPU enabled but not available. Falling back to CPU.")
        else:
            LOGGER.info("Using CPU (GPU disabled in settings)")
    
    LOGGER.info("Loading Grounding DINO and CLIP models on device: %s", device)

    try:
        components = build_runtime_components(device)
    except Exception as exc:
        LOGGER.exception("Runtime bootstrap failed")
        raise RuntimeError("Runtime bootstrap failed") from exc

    application.state.process_garments_use_case = components.process_garments_use_case
    application.state.calculate_warmth_index_use_case = components.calculate_warmth_index_use_case
    application.state.response_builder = components.response_builder
    LOGGER.info("Runtime components initialized")
    yield
