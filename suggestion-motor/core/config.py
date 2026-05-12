try:
    from pydantic_settings import BaseSettings
except Exception:
    from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    EASYPICK_API_BASE_URL: Optional[str] = None
    EASYPICK_REFRESH_TOKEN: Optional[str] = None
    EASYPICK_AUTH_REFRESH_ENDPOINT: str = "/auth/refresh"
    GARMENT_CONFIG_ENDPOINT: str = "/garments/configurations"
    LLM_MODEL_PATH: Optional[str] = None
    LLM_MODEL_ID: str = "google/gemma-2-2b-it"
    # 'auto' will pick GPU if available, otherwise CPU. Can be 'auto', 'gpu' or 'cpu'.
    LLM_BACKEND: str = "auto"
    HUGGINGFACE_ACCESS_TOKEN: Optional[str] = None
    HUGGINGFACE_HUB_TOKEN: Optional[str] = None
    HF_TOKEN: Optional[str] = None
    EXPECTED_OUTFITS: int = 3
    GARMENT_CONFIG_TIMEOUT_SECONDS: int = 10

    class Config:
        env_file = ".env"
