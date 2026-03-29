from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.controllers import garment_router
from app.lifespan import app_lifespan


def create_app() -> FastAPI:
    app = FastAPI(
        title="EasyPick Garment Processor",
        description="Local microservice for YOLO + rembg + CLIP garment processing",
        version="1.0.0",
        lifespan=app_lifespan,
    )

    app.include_router(garment_router)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_, exc: HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    return app
