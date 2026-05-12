from __future__ import annotations
import abc
from typing import Optional


class WeatherProvider(abc.ABC):
    """Abstract interface for weather data."""

    @abc.abstractmethod
    async def get_temperature(self, latitude: float, longitude: float) -> Optional[float]:
        """Get current temperature in Celsius at the given location."""

    @abc.abstractmethod
    async def get_weather_description(self, latitude: float, longitude: float) -> Optional[str]:
        """Get weather description at the given location."""
