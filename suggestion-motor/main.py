import os
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from core.config import Settings
from core.dependencies import get_llm_provider
from infrastructure.state.memory_cache import MemoryCache
from infrastructure.gateways.spring_boot_client import SpringBootClient
from presentation.controllers.suggestion_router import router as suggestion_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("suggestion-motor")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    settings = Settings()
    api_client = SpringBootClient(settings)

    # 1. Request short-lived JWT from EasyPick API
    access_token = None
    if settings.EASYPICK_REFRESH_TOKEN and settings.EASYPICK_API_BASE_URL:
        try:
            access_token = await api_client.refresh_token()
            if access_token:
                logger.info("Successfully refreshed access token from EasyPick API")
            else:
                logger.warning("Failed to refresh access token; continuing without remote config")
        except Exception as e:
            logger.warning("Exception during token refresh: %s", e)

    # 2. Fetch garment configurations if we have a token
    if access_token:
        try:
            configs = await api_client.fetch_garment_configurations(access_token)
            if configs:
                MemoryCache.set("garment_configurations", configs)
                logger.info("Successfully cached garment configurations")
        except Exception as e:
            logger.warning("Exception fetching garment configs: %s", e)

    # 3. Initialize LLM provider
    llm = get_llm_provider()
    try:
        await llm.load()
        logger.info("LLM engine loaded successfully")
    except Exception as e:
        logger.warning("LLM engine failed to load at startup: %s", e)

    yield


app = FastAPI(lifespan=lifespan)
settings = Settings()
app.include_router(suggestion_router, prefix=settings.SUGGESTION_PROCESS_ENDPOINT)


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
