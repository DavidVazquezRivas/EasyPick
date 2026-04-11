from __future__ import annotations

import logging
from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from app.adapters.http.error_mapper import map_exception_to_http_error
from app.api import InputValidator
from app.exceptions import InvalidInputError
from app.models.process_garments_response import ProcessGarmentsResponse
from app.utils.request_context import get_request_id

LOGGER = logging.getLogger(__name__)
router = APIRouter(tags=["garment-processing"])


@router.post("/process-garments", response_model=ProcessGarmentsResponse)
async def process_garments(request: Request, image: UploadFile = File(...)) -> ProcessGarmentsResponse:
    request_id = get_request_id()
    LOGGER.info("Processing image | request_id=%s filename=%s", request_id, image.filename)
    try:
        validated_image = await InputValidator.validate_upload(image)
        LOGGER.info("Image validated | request_id=%s size=%s", request_id, validated_image.image.size)
    except InvalidInputError as exc:
        LOGGER.warning("Input validation failed | request_id=%s error=%s", request_id, exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        LOGGER.info("Starting garment processing use case | request_id=%s", request_id)
        use_case = request.app.state.process_garments_use_case

        raw_garments = use_case.execute(validated_image.image)
        LOGGER.info("Use case returned garments | request_id=%s count=%s", request_id, len(raw_garments))

        LOGGER.info("Building response | request_id=%s", request_id)
        garments = request.app.state.response_builder.build_many(raw_garments)
        LOGGER.info("Response built | request_id=%s garments=%s", request_id, len(garments))
    except HTTPException:
        raise
    except Exception as exc:
        mapped_error = map_exception_to_http_error(exc)
        if mapped_error.status_code >= 500:
            LOGGER.exception("Unexpected error | request_id=%s error=%s", request_id, exc)
        elif isinstance(exc, InvalidInputError):
            LOGGER.warning("Invalid input | request_id=%s error=%s", request_id, exc)
        else:
            LOGGER.warning("Processing error | request_id=%s error=%s", request_id, exc)
        raise HTTPException(status_code=mapped_error.status_code, detail=mapped_error.detail) from exc

    if not garments:
        LOGGER.warning("No garments detected | request_id=%s", request_id)
        raise HTTPException(status_code=422, detail="No garments detected in image")

    LOGGER.info("Returning response | request_id=%s garments=%s", request_id, len(garments))
    return ProcessGarmentsResponse(
        garments=garments,
        mime_type="image/png",
    )
