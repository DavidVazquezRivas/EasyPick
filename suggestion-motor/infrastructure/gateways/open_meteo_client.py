import logging
from typing import Optional
import httpx

from application.interfaces.weather_provider import WeatherProvider

logger = logging.getLogger("open_meteo_client")


class OpenMeteoClient(WeatherProvider):
    """Adapter for OpenMeteo free weather API."""

    OPENMETEO_BASE_URL = "https://api.open-meteo.com/v1/forecast"

    async def get_temperature(self, latitude: float, longitude: float) -> Optional[float]:
        """Get current temperature in Celsius."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.OPENMETEO_BASE_URL,
                    params={
                        "latitude": latitude,
                        "longitude": longitude,
                        "current": "temperature_2m",
                        "timezone": "auto",
                    },
                    timeout=10.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    current = data.get("current")
                    if current:
                        return current.get("temperature_2m")
        except Exception as exc:
            logger.warning("Exception fetching temperature from Open-Meteo: %s", exc)
        return None

    async def get_weather_description(self, latitude: float, longitude: float) -> Optional[str]:
        """Get weather description (based on WMO code)."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.OPENMETEO_BASE_URL,
                    params={
                        "latitude": latitude,
                        "longitude": longitude,
                        "current": "weather_code",
                        "timezone": "auto",
                    },
                    timeout=10.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    current = data.get("current")
                    if current:
                        code = current.get("weather_code")
                        return self._wmo_code_to_description(code)
        except Exception as exc:
            logger.warning("Exception fetching weather from Open-Meteo: %s", exc)
        return None

    @staticmethod
    def _wmo_code_to_description(code: int) -> str:
        """Simple WMO code to description mapping."""
        wmo_map = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            51: "Light drizzle",
            61: "Slight rain",
            80: "Slight rain showers",
            95: "Thunderstorm",
        }
        return wmo_map.get(code, "Unknown")
