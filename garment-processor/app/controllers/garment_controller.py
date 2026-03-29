from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from app.api import InputValidator
from app.exceptions import (
    BackgroundRemovalError,
    ClipClassificationError,
    InvalidInputError,
    YoloDetectionError,
)
from app.models.process_garments_response import ProcessGarmentsResponse

router = APIRouter(tags=["garment-processing"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/process-garments", response_model=ProcessGarmentsResponse)
async def process_garments(request: Request, image: UploadFile = File(...)) -> ProcessGarmentsResponse:
    try:
        validated_image = await InputValidator.validate_upload(image)
    except InvalidInputError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        raw_garments = request.app.state.orchestrator.process(validated_image.image)
        garments = request.app.state.response_builder.build_many(raw_garments)
    except InvalidInputError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except (YoloDetectionError, BackgroundRemovalError, ClipClassificationError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Processing failed") from exc

    if not garments:
        raise HTTPException(status_code=422, detail="No garments detected in image")

    return ProcessGarmentsResponse(garments=garments)
