import logging
from typing import Optional, Dict, Any
import httpx

from application.interfaces.api_gateway import APIGateway
from core.config import Settings

logger = logging.getLogger("spring_boot_client")


class SpringBootClient(APIGateway):
    """Adapter that communicates with EasyPick API (Spring Boot backend)."""

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or Settings()
        self.base_url = self.settings.EASYPICK_API_BASE_URL
        self.refresh_token = self.settings.EASYPICK_REFRESH_TOKEN
        self.refresh_endpoint = self.settings.EASYPICK_AUTH_REFRESH_ENDPOINT
        self.config_endpoint = self.settings.GARMENT_CONFIG_ENDPOINT

    async def refresh_token_impl(self) -> Optional[str]:
        """POST to /auth/refresh with the refresh token to get a new access token."""
        if not self.base_url or not self.refresh_token:
            logger.warning("Base URL or refresh token not configured; skipping token refresh")
            return None

        url = f"{self.base_url}{self.refresh_endpoint}"
        payload = {"refreshToken": self.refresh_token}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=payload,
                    timeout=float(self.settings.GARMENT_CONFIG_TIMEOUT_SECONDS),
                )
                if response.status_code < 200 or response.status_code >= 300:
                    logger.warning("Failed to refresh token: %s", response.status_code)
                    return None

                data = response.json()
                access_token = data.get("data", {}).get("accessToken")
                if isinstance(access_token, str) and access_token.strip():
                    return access_token.strip()
                else:
                    logger.warning("No valid accessToken in refresh response")
                    return None
            except Exception as exc:
                logger.warning("Exception during token refresh: %s", exc)
                return None

    async def refresh_token(self) -> Optional[str]:
        """Public method for token refresh."""
        return await self.refresh_token_impl()

    async def fetch_garment_configurations(self, token: str) -> Optional[Dict[str, Any]]:
        """GET /garments/configurations to fetch available brands, colors, categories, styles."""
        if not self.base_url:
            logger.warning("Base URL not configured")
            return None

        url = f"{self.base_url}{self.config_endpoint}"
        headers = {"Authorization": f"Bearer {token}"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    url,
                    headers=headers,
                    timeout=float(self.settings.GARMENT_CONFIG_TIMEOUT_SECONDS),
                )
                if response.status_code < 200 or response.status_code >= 300:
                    logger.warning("Failed to fetch garment configs: %s", response.status_code)
                    return None

                return response.json()
            except Exception as exc:
                logger.warning("Exception during garment config fetch: %s", exc)
                return None
