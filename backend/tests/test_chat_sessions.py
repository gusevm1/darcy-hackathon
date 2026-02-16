"""Tests for chat session CRUD endpoints."""

from fastapi.testclient import TestClient


def test_create_session(client: TestClient) -> None:
    resp = client.post("/api/consult/sessions", json={})
    assert resp.status_code == 200
    data = resp.json()
    assert "session_id" in data
    assert len(data["session_id"]) > 0


def test_create_session_with_client(client: TestClient) -> None:
    resp = client.post(
        "/api/consult/sessions",
        json={"client_id": "thomas-muller"},
    )
    assert resp.status_code == 200
    session_id = resp.json()["session_id"]

    # Fetch and verify client_id
    get_resp = client.get(f"/api/consult/sessions/{session_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["client_id"] == "thomas-muller"


def test_list_sessions_empty(client: TestClient) -> None:
    resp = client.get("/api/consult/sessions")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_list_sessions_filtered(client: TestClient) -> None:
    # Create sessions for different clients
    client.post(
        "/api/consult/sessions",
        json={"client_id": "client-a"},
    )
    client.post(
        "/api/consult/sessions",
        json={"client_id": "client-b"},
    )

    resp = client.get(
        "/api/consult/sessions?client_id=client-a"
    )
    assert resp.status_code == 200
    sessions = resp.json()
    for s in sessions:
        assert s["client_id"] == "client-a"


def test_get_session(client: TestClient) -> None:
    create_resp = client.post(
        "/api/consult/sessions", json={}
    )
    session_id = create_resp.json()["session_id"]

    resp = client.get(f"/api/consult/sessions/{session_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == session_id
    assert data["title"] == "New conversation"
    assert data["messages"] == []


def test_get_session_not_found(client: TestClient) -> None:
    resp = client.get("/api/consult/sessions/nonexistent")
    assert resp.status_code == 404


def test_delete_session(client: TestClient) -> None:
    create_resp = client.post(
        "/api/consult/sessions", json={}
    )
    session_id = create_resp.json()["session_id"]

    resp = client.delete(
        f"/api/consult/sessions/{session_id}"
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "deleted"

    # Verify gone
    get_resp = client.get(
        f"/api/consult/sessions/{session_id}"
    )
    assert get_resp.status_code == 404


def test_delete_session_not_found(client: TestClient) -> None:
    resp = client.delete("/api/consult/sessions/nonexistent")
    assert resp.status_code == 404
