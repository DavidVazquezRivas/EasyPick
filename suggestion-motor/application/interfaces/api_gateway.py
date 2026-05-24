from __future__ import annotations
import abc
from typing import Any, Optional, Dict


class APIGateway(abc.ABC):
    """Abstract interface for communication with the main EasyPick API."""

    @abc.abstractmethod
    async def refresh_token(self) -> Optional[str]:
        """Refresh access token using the refresh token. Returns new JWT or None on failure."""

    @abc.abstractmethod
    async def fetch_garment_configurations(self, token: str) -> Optional[Dict[str, Any]]:
        """Fetch garment configurations (brands, colors, categories, styles, etc.) from the main API."""
