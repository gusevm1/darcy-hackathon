"""Tests for EHP comment CRUD endpoints."""

from fastapi.testclient import TestClient


def _create_client(client: TestClient) -> str:
    """Helper to create a test client and return its ID."""
    resp = client.post(
        "/api/clients", json={"company_name": "EHP Test AG"}
    )
    return resp.json()["id"]


def test_list_comments_empty(client: TestClient) -> None:
    client_id = _create_client(client)
    resp = client.get(f"/api/ehp/{client_id}/banking-1-1")
    assert resp.status_code == 200
    assert resp.json() == []


def test_add_comment(client: TestClient) -> None:
    client_id = _create_client(client)
    resp = client.post(
        f"/api/ehp/{client_id}/banking-1-1",
        json={
            "author": "M. Brunner",
            "role": "finma-reviewer",
            "content": "Please clarify deposit volumes.",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["author"] == "M. Brunner"
    assert data["role"] == "finma-reviewer"
    assert data["content"] == "Please clarify deposit volumes."
    assert data["client_id"] == client_id
    assert data["document_id"] == "banking-1-1"
    assert data["resolved"] is False
    assert data["ai_generated"] is False


def test_list_comments_after_add(client: TestClient) -> None:
    client_id = _create_client(client)
    client.post(
        f"/api/ehp/{client_id}/doc-1",
        json={
            "author": "Tester",
            "role": "consultant",
            "content": "Comment 1",
        },
    )
    client.post(
        f"/api/ehp/{client_id}/doc-1",
        json={
            "author": "Reviewer",
            "role": "finma-reviewer",
            "content": "Comment 2",
        },
    )

    resp = client.get(f"/api/ehp/{client_id}/doc-1")
    assert resp.status_code == 200
    comments = resp.json()
    assert len(comments) == 2


def test_toggle_resolve(client: TestClient) -> None:
    client_id = _create_client(client)
    add_resp = client.post(
        f"/api/ehp/{client_id}/doc-1",
        json={
            "author": "M. Brunner",
            "role": "finma-reviewer",
            "content": "Issue found.",
        },
    )
    comment_id = add_resp.json()["id"]

    # Toggle to resolved
    resp = client.patch(f"/api/ehp/{comment_id}/resolve")
    assert resp.status_code == 200
    assert resp.json()["resolved"] is True

    # Toggle back to unresolved
    resp = client.patch(f"/api/ehp/{comment_id}/resolve")
    assert resp.status_code == 200
    assert resp.json()["resolved"] is False


def test_toggle_resolve_not_found(client: TestClient) -> None:
    resp = client.patch("/api/ehp/nonexistent/resolve")
    assert resp.status_code == 404
