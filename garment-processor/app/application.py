from __future__ import annotations

import logging
import time
import uuid

from fastapi import FastAPI, HTTPException
from fastapi import Request
from fastapi.responses import JSONResponse

from app.adapters.http import garment_router, health_router
from app.lifespan import app_lifespan
from app.utils.request_context import reset_request_id, set_request_id

LOGGER = logging.getLogger(__name__)


def create_app(*, enable_lifespan: bool = True) -> FastAPI:
    if enable_lifespan:
        app = FastAPI(
            title="EasyPick Garment Processor",
            description="Local microservice for Grounding DINO + rembg + CLIP garment processing",
            version="1.0.0",
            lifespan=app_lifespan,
        )
    else:
        app = FastAPI(
            title="EasyPick Garment Processor",
            description="Local microservice for Grounding DINO + rembg + CLIP garment processing",
            version="1.0.0",
        )

    @app.middleware("http")
    async def request_context_middleware(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        token = set_request_id(request_id)
        request.state.request_id = request_id
        t0 = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception:
            LOGGER.exception("Unhandled request error | request_id=%s path=%s", request_id, request.url.path)
            raise
        finally:
            reset_request_id(token)

        elapsed_ms = int((time.perf_counter() - t0) * 1000)
        response.headers["x-request-id"] = request_id
        LOGGER.info(
            "Request completed | request_id=%s method=%s path=%s status=%s elapsed_ms=%s",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response

    app.include_router(health_router)
    app.include_router(garment_router)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_, exc: HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    return app
