import asyncio
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from core.config import Settings
from core.dependencies import get_llm_provider
from infrastructure.state.memory_cache import MemoryCache
from infrastructure.gateways.spring_boot_client import SpringBootClient
from infrastructure.translation.name_translator import translate_config_names
from presentation.controllers.suggestion_router import router as suggestion_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("suggestion-motor")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    settings = Settings()
    api_client = SpringBootClient(settings)

    # 1. Fetch garment configurations from API with retry (Spring Boot takes ~30s to start)
    if settings.EASYPICK_REFRESH_TOKEN and settings.EASYPICK_API_BASE_URL:
        max_retries = 12
        for attempt in range(max_retries):
            try:
                token = await api_client.refresh_token()
                if token:
                    logger.info("Access token refreshed on attempt %d", attempt + 1)
                    configs = await api_client.fetch_garment_configurations(token)
                    if configs:
                        MemoryCache.set("garment_configurations", configs)
                        logger.info("Garment configurations cached on attempt %d", attempt + 1)
                        data = configs.get("data", {})
                        for key in ("categories", "styles", "colors", "brands"):
                            items = data.get(key, [])
                            logger.info("  %s (%d): %s", key, len(items), [i.get("name", "?") for i in items])
                        break
            except Exception as e:
                logger.warning("Config fetch attempt %d failed: %s", attempt + 1, e)
            if attempt < max_retries - 1:
                delay = min(2 ** (attempt + 1), 30)
                logger.info("API not ready yet, retrying in %ds...", delay)
                await asyncio.sleep(delay)
        else:
            logger.warning("Failed to fetch garment configs after %d attempts", max_retries)

    # 2. Load LLM
    llm = get_llm_provider()
    try:
        await llm.load()
        logger.info("LLM engine loaded successfully")
        # Hardcoded translations (LLM-based translation was too slow on CPU)
        await translate_config_names(llm)
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
