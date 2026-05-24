from infrastructure.llm.gemma_local_engine import get_default_engine
from infrastructure.gateways.open_meteo_client import OpenMeteoClient
from core.config import Settings


_ENGINE = None
_WEATHER_PROVIDER = None


def get_llm_provider():
    global _ENGINE
    if _ENGINE is None:
        settings = Settings()
        _ENGINE = get_default_engine(
            model_path=settings.LLM_MODEL_PATH,
            backend=settings.LLM_BACKEND,
            model_id=settings.LLM_MODEL_ID,
        )
    return _ENGINE


def get_weather_provider():
    global _WEATHER_PROVIDER
    if _WEATHER_PROVIDER is None:
        _WEATHER_PROVIDER = OpenMeteoClient()
    return _WEATHER_PROVIDER
