import pytest
import asyncio
from fastapi import FastAPI
from httpx import AsyncClient

from main import app
from core.dependencies import get_llm_provider, get_weather_provider
from application.entities.garment import Garment


class TestLLM:
    def __init__(self, response_text):
        self.response_text = response_text

    async def load(self):
        return None

    async def generate(self, prompt, temperature=0.4, max_tokens=256):
        return {"text": self.response_text}


@pytest.mark.asyncio
async def test_deterministic_generation(monkeypatch):
    # Prepare mock LLM and weather
    monkeypatch.setenv("EASYPICK_API_BASE_URL", "")
    mock_llm = TestLLM('{"outfits": []}')
    mock_weather = type("W", (), {"get_temperature": lambda *_: 30.0})()

    # Patch core.dependencies functions so both startup and DI use mocks
    import core.dependencies as deps
    deps.get_llm_provider = lambda: mock_llm
    deps.get_weather_provider = lambda: mock_weather

    async with AsyncClient(app=app, base_url="http://test") as client:
        payload = {
            "user_location": {"latitude": 39.0, "longitude": -0.1},
            "expected_outfits": 1,
            "garments": [
                {"uuid": "g1", "type": "t_shirt", "color": "black", "warm_index": 1.5},
                {"uuid": "g2", "type": "shirt", "color": "white", "warm_index": 1.0},
                {"uuid": "g3", "type": "shorts", "color": "blue", "warm_index": 2.0},
                {"uuid": "g4", "type": "coat", "color": "red", "warm_index": 8.0},
            ],
        }

        resp = await client.post("/api/v1/suggestions/generate", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert "outfits" in body
        assert len(body["outfits"]) >= 1


@pytest.mark.asyncio
async def test_llm_generation_fallback(monkeypatch):
    # Prepare mock LLM that returns one additional outfit
    monkeypatch.setenv("EASYPICK_API_BASE_URL", "")
    llm_output = '{"outfits": [{"garment_uuids": ["g1","g2","g3"]}]}'
    mock_llm = TestLLM(llm_output)
    mock_weather = type("W", (), {"get_temperature": lambda *_: 30.0})()

    import core.dependencies as deps
    deps.get_llm_provider = lambda: mock_llm
    deps.get_weather_provider = lambda: mock_weather

    async with AsyncClient(app=app, base_url="http://test") as client:
        payload = {
            "user_location": {"latitude": 39.0, "longitude": -0.1},
            "expected_outfits": 2,
            "garments": [
                {"uuid": "g1", "type": "t_shirt", "color": "black", "warm_index": 1.5},
                {"uuid": "g2", "type": "shirt", "color": "white", "warm_index": 1.0},
                {"uuid": "g3", "type": "shorts", "color": "blue", "warm_index": 2.0},
            ],
        }

        resp = await client.post("/api/v1/suggestions/generate", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert "outfits" in body
        assert len(body["outfits"]) == 2
