from __future__ import annotations

import logging
from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from app.api import InputValidator
from app.exceptions import (
    BackgroundRemovalError,
    ClipClassificationError,
    InvalidInputError,
    YoloDetectionError,
)
from app.models.process_garments_response import ProcessGarmentsResponse

LOGGER = logging.getLogger(__name__)
router = APIRouter(tags=["garment-processing"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/process-garments", response_model=ProcessGarmentsResponse)
async def process_garments(request: Request, image: UploadFile = File(...)) -> ProcessGarmentsResponse:
    LOGGER.info(f"Processing image: {image.filename}")
    try:
        validated_image = await InputValidator.validate_upload(image)
        LOGGER.info(f"Image validated: {validated_image.image.size}")
    except InvalidInputError as exc:
        LOGGER.warning(f"Input validation failed: {exc}")
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        LOGGER.info("Starting orchestrator processing")
        raw_garments = request.app.state.orchestrator.process(validated_image.image)
        LOGGER.info(f"Orchestrator returned {len(raw_garments)} garments")
        
        LOGGER.info("Building response")
        garment_pngs_base64, garments = request.app.state.response_builder.build_many(raw_garments)
        LOGGER.info(f"Response built: {len(garments)} garments")
    except InvalidInputError as exc:
        LOGGER.warning(f"Invalid input: {exc}")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except (YoloDetectionError, BackgroundRemovalError, ClipClassificationError) as exc:
        LOGGER.warning(f"Processing error: {exc}")
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        LOGGER.exception(f"Unexpected error: {exc}")
        raise HTTPException(status_code=500, detail="Processing failed") from exc

    if not garments:
        LOGGER.warning("No garments detected")
        raise HTTPException(status_code=422, detail="No garments detected in image")

    LOGGER.info(f"Returning response with {len(garments)} garments")
    return ProcessGarmentsResponse(
        garment_pngs_base64=garment_pngs_base64,
        garments=garments,
        mime_type="image/png",
    )
