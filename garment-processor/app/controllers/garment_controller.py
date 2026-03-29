from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from app.config import SETTINGS
from app.models.process_garments_response import ProcessGarmentsResponse
from app.utils.image_io import InvalidImageError, load_image_from_bytes

router = APIRouter(tags=["garment-processing"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/process-garments", response_model=ProcessGarmentsResponse)
async def process_garments(request: Request, image: UploadFile = File(...)) -> ProcessGarmentsResponse:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    content = await image.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Image file is empty")
    if len(content) > SETTINGS.max_upload_size_bytes:
        raise HTTPException(status_code=400, detail="Image exceeds max upload size")

    try:
        pil_image = load_image_from_bytes(content)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        garments = request.app.state.pipeline.process(pil_image)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Processing failed: {exc}") from exc

    if not garments:
        raise HTTPException(status_code=422, detail="No garments detected in image")

    return ProcessGarmentsResponse(garments=garments)
