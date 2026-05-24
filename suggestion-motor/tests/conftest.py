import os
import asyncio
import pytest
import sys
from pathlib import Path

# Ensure project root is on sys.path so tests can import application/ modules
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


class MockLLM:
    def __init__(self, text_response=None):
        self.text_response = text_response or '{"outfits": []}'

    async def load(self):
        return None

    async def generate(self, prompt: str, temperature: float = 0.4, max_tokens: int = 256):
        return {"text": self.text_response}


class MockWeather:
    def __init__(self, temp=None):
        self.temp = temp

    async def get_temperature(self, lat, lon):
        return self.temp

    async def get_weather_description(self, lat, lon):
        return "Clear"


@pytest.fixture(autouse=True)
def env_isolate(monkeypatch):
    # Prevent main.lifespan from calling external EasyPick by clearing env vars
    monkeypatch.setenv("EASYPICK_API_BASE_URL", "")
    monkeypatch.setenv("EASYPICK_REFRESH_TOKEN", "")
    yield


@pytest.fixture
def mock_llm():
    return MockLLM()


@pytest.fixture
def mock_weather():
    return MockWeather()
