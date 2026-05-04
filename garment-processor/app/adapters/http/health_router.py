from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from app.config import SETTINGS

router = APIRouter(tags=["health"])


@router.get("/health")
def health_compat() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/live")
def health_live() -> dict[str, str]:
    return {"status": "alive"}


@router.get("/health/ready")
def health_ready(request: Request) -> dict[str, str]:
    use_case = getattr(request.app.state, "process_garments_use_case", None)
    warmth_use_case = getattr(request.app.state, "calculate_warmth_index_use_case", None)
    response_builder = getattr(request.app.state, "response_builder", None)
    if use_case is None or warmth_use_case is None or response_builder is None:
        raise HTTPException(status_code=503, detail="Service not ready")

    return {
        "status": "ready",
        "segmentation_backend": SETTINGS.segmentation_backend,
    }
