from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient


def test_health_check(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in {"healthy", "degraded", "unhealthy"}
    assert "services" in data
    assert "database" in data["services"]
    assert "qdrant" in data["services"]
    assert "openai" in data["services"]
    for svc in data["services"].values():
        assert svc["status"] in {"up", "down"}
        assert "latency_ms" in svc


def test_health_database_up(client: TestClient) -> None:
    """Database should always be up in tests (uses temp SQLite)."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["services"]["database"]["status"] == "up"


def test_health_contains_all_service_keys(client: TestClient) -> None:
    """Response must contain exactly the expected service keys."""
    response = client.get("/health")
    assert response.status_code == 200
    services = response.json()["services"]
    assert set(services.keys()) == {"database", "qdrant", "openai"}


def test_health_latency_non_negative(client: TestClient) -> None:
    """All latency_ms values should be non-negative numbers."""
    response = client.get("/health")
    assert response.status_code == 200
    for svc in response.json()["services"].values():
        assert isinstance(svc["latency_ms"], (int, float))
        assert svc["latency_ms"] >= 0


def test_health_qdrant_down_is_unhealthy(client: TestClient) -> None:
    """When Qdrant is unreachable, overall status should be 'unhealthy'."""
    from src.services.rag_service import _default_instance

    with patch.object(
        _default_instance,
        "_require_qdrant",
        side_effect=RuntimeError("connection refused"),
    ):
        response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unhealthy"
    assert data["services"]["qdrant"]["status"] == "down"


def test_health_openai_down_is_degraded(client: TestClient) -> None:
    """When only OpenAI is down (non-critical), status should be 'degraded'."""
    from src.services.rag_service import _default_instance

    # Ensure Qdrant check passes by mocking it to return a mock client
    mock_qdrant = AsyncMock()
    mock_qdrant.get_collections = AsyncMock(return_value=AsyncMock(collections=[]))

    with (
        patch.object(
            _default_instance,
            "_require_qdrant",
            return_value=mock_qdrant,
        ),
        patch.object(
            _default_instance,
            "_require_openai",
            side_effect=RuntimeError("OpenAI not configured"),
        ),
    ):
        response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "degraded"
    assert data["services"]["openai"]["status"] == "down"
    assert data["services"]["qdrant"]["status"] == "up"
