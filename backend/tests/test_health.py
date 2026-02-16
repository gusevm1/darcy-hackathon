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
