"""Tests for client CRUD endpoints."""

import pytest
from fastapi.testclient import TestClient


def test_create_client(client: TestClient) -> None:
    resp = client.post(
        "/api/clients",
        json={"company_name": "Test AG", "contact_name": "Max"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["company_name"] == "Test AG"
    assert data["contact_name"] == "Max"
    assert data["status"] == "intake"
    assert "id" in data


def test_get_client(client: TestClient) -> None:
    # Create
    create_resp = client.post(
        "/api/clients", json={"company_name": "Fetch AG"}
    )
    client_id = create_resp.json()["id"]

    # Get
    resp = client.get(f"/api/clients/{client_id}")
    assert resp.status_code == 200
    assert resp.json()["company_name"] == "Fetch AG"


def test_get_client_not_found(client: TestClient) -> None:
    resp = client.get("/api/clients/nonexistent-id")
    assert resp.status_code == 404


def test_list_clients(client: TestClient) -> None:
    # Create two clients
    client.post("/api/clients", json={"company_name": "List A"})
    client.post("/api/clients", json={"company_name": "List B"})

    resp = client.get("/api/clients")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 2
    assert len(data["items"]) >= 2


def test_update_client(client: TestClient) -> None:
    create_resp = client.post(
        "/api/clients", json={"company_name": "Old Name"}
    )
    client_id = create_resp.json()["id"]

    resp = client.patch(
        f"/api/clients/{client_id}",
        json={"company_name": "New Name", "legal_structure": "AG"},
    )
    assert resp.status_code == 200
    assert resp.json()["company_name"] == "New Name"
    assert resp.json()["legal_structure"] == "AG"


def test_update_client_not_found(client: TestClient) -> None:
    resp = client.patch(
        "/api/clients/nonexistent-id", json={"company_name": "X"}
    )
    assert resp.status_code == 404


def test_delete_client(client: TestClient) -> None:
    create_resp = client.post(
        "/api/clients", json={"company_name": "Delete Me"}
    )
    client_id = create_resp.json()["id"]

    resp = client.delete(f"/api/clients/{client_id}")
    assert resp.status_code == 200
    assert resp.json()["deleted"] is True

    # Verify gone
    resp = client.get(f"/api/clients/{client_id}")
    assert resp.status_code == 404


def test_delete_client_not_found(client: TestClient) -> None:
    resp = client.delete("/api/clients/nonexistent-id")
    assert resp.status_code == 404


@pytest.mark.parametrize(
    "field,value",
    [
        ("has_swiss_office", True),
        ("has_aml_officer", True),
        ("existing_capital_chf", 500_000),
    ],
)
def test_update_boolean_and_int_fields(
    client: TestClient, field: str, value: object
) -> None:
    create_resp = client.post(
        "/api/clients", json={"company_name": "Fields AG"}
    )
    client_id = create_resp.json()["id"]

    resp = client.patch(
        f"/api/clients/{client_id}", json={field: value}
    )
    assert resp.status_code == 200
    assert resp.json()[field] == value
