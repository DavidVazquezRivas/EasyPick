import pytest
import asyncio
from fastapi import FastAPI
from httpx import AsyncClient

from main import app
from core.dependencies import get_llm_provider, get_weather_provider


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
            "colorPreferences": [],
            "brandPreferences": [],
            "categoryPreferences": [],
            "stylePreferences": [],
            "requestedOutfitCount": 1,
            "location": {"lat": 39.0, "lng": -0.1},
            "garments": [
                {
                    "id": "g1",
                    "category": {"id": "cat-top", "name": "t_shirt"},
                    "style": {"id": "style-casual", "name": "casual"},
                    "colors": [{"id": "c1", "name": "black"}],
                },
                {
                    "id": "g2",
                    "category": {"id": "cat-top", "name": "shirt"},
                    "style": {"id": "style-smart", "name": "smart"},
                    "colors": [{"id": "c2", "name": "white"}],
                },
                {
                    "id": "g3",
                    "category": {"id": "cat-bottom", "name": "shorts"},
                    "style": {"id": "style-casual", "name": "casual"},
                    "colors": [{"id": "c3", "name": "blue"}],
                },
                {
                    "id": "g4",
                    "category": {"id": "cat-outer", "name": "coat"},
                    "style": {"id": "style-elegant", "name": "elegant"},
                    "colors": [{"id": "c4", "name": "red"}],
                },
            ],
            "previousSuggestions": [],
        }

        resp = await client.post("/suggest", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert "outfits" in body
        assert len(body["outfits"]) >= 1
        assert "garmentIds" in body["outfits"][0]


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
            "colorPreferences": [],
            "brandPreferences": [],
            "categoryPreferences": [],
            "stylePreferences": [],
            "requestedOutfitCount": 2,
            "location": {"lat": 39.0, "lng": -0.1},
            "garments": [
                {
                    "id": "g1",
                    "category": {"id": "cat-top", "name": "t_shirt"},
                    "style": {"id": "style-casual", "name": "casual"},
                    "colors": [{"id": "c1", "name": "black"}],
                },
                {
                    "id": "g2",
                    "category": {"id": "cat-top", "name": "shirt"},
                    "style": {"id": "style-smart", "name": "smart"},
                    "colors": [{"id": "c2", "name": "white"}],
                },
                {
                    "id": "g3",
                    "category": {"id": "cat-bottom", "name": "shorts"},
                    "style": {"id": "style-casual", "name": "casual"},
                    "colors": [{"id": "c3", "name": "blue"}],
                },
            ],
            "previousSuggestions": [],
        }

        resp = await client.post("/suggest", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert "outfits" in body
        assert len(body["outfits"]) == 2
        assert "garmentIds" in body["outfits"][0]
