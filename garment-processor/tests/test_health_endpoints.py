from __future__ import annotations

from fastapi.testclient import TestClient

from app.application import create_app


def test_health_live_returns_alive() -> None:
    app = create_app(enable_lifespan=False)
    with TestClient(app) as client:
        response = client.get("/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "alive"}


def test_health_ready_returns_503_when_components_missing() -> None:
    app = create_app(enable_lifespan=False)
    with TestClient(app) as client:
        response = client.get("/health/ready")

    assert response.status_code == 503
    assert response.json()["detail"] == "Service not ready"


def test_health_ready_returns_ready_when_use_case_and_response_builder_present() -> None:
    app = create_app(enable_lifespan=False)
    app.state.process_garments_use_case = object()
    app.state.response_builder = object()

    with TestClient(app) as client:
        response = client.get("/health/ready")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ready"
    assert payload["segmentation_backend"] == "grounding_dino"


def test_request_id_is_echoed_in_response_headers() -> None:
    app = create_app(enable_lifespan=False)
    with TestClient(app) as client:
        response = client.get("/health/live", headers={"x-request-id": "test-request-123"})

    assert response.status_code == 200
    assert response.headers["x-request-id"] == "test-request-123"