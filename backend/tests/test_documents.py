"""Tests for document upload, listing, and verification endpoints."""

import io

from fastapi.testclient import TestClient


def _create_client(client: TestClient) -> str:
    resp = client.post("/api/clients", json={"company_name": "Doc Test AG"})
    return resp.json()["id"]


def _upload(
    client: TestClient,
    client_id: str,
    doc_id: str,
    content: bytes = b"fake data",
    filename: str = "test.txt",
    content_type: str = "text/plain",
) -> dict[str, object]:
    resp = client.post(
        f"/api/client-documents/{client_id}/upload?document_id={doc_id}",
        files={"file": (filename, io.BytesIO(content), content_type)},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()


def test_upload_document(client: TestClient) -> None:
    client_id = _create_client(client)
    data = _upload(client, client_id, "banking-1-01")
    assert data["client_id"] == client_id
    assert data["document_id"] == "banking-1-01"
    assert data["file_name"] == "test.txt"
    assert int(str(data["file_size"])) > 0


def test_upload_missing_document_id(client: TestClient) -> None:
    client_id = _create_client(client)
    resp = client.post(
        f"/api/client-documents/{client_id}/upload?document_id=",
        files={"file": ("test.txt", io.BytesIO(b"content"), "text/plain")},
    )
    assert resp.status_code == 400


def test_list_documents(client: TestClient) -> None:
    client_id = _create_client(client)
    _upload(client, client_id, "doc-a")
    resp = client.get(f"/api/client-documents/{client_id}")
    assert resp.status_code == 200
    docs = resp.json()
    assert len(docs) >= 1
    assert any(d["document_id"] == "doc-a" for d in docs)


def test_get_document(client: TestClient) -> None:
    client_id = _create_client(client)
    _upload(client, client_id, "doc-b")
    resp = client.get(f"/api/client-documents/{client_id}/doc-b")
    assert resp.status_code == 200
    assert resp.json()["document_id"] == "doc-b"


def test_get_document_not_found(client: TestClient) -> None:
    client_id = _create_client(client)
    resp = client.get(f"/api/client-documents/{client_id}/nonexistent")
    assert resp.status_code == 404


def test_delete_document(client: TestClient) -> None:
    client_id = _create_client(client)
    _upload(client, client_id, "doc-c")
    resp = client.delete(f"/api/client-documents/{client_id}/doc-c")
    assert resp.status_code == 200
    assert resp.json()["status"] == "deleted"

    # Verify gone
    resp = client.get(f"/api/client-documents/{client_id}/doc-c")
    assert resp.status_code == 404


def test_download_document(client: TestClient) -> None:
    client_id = _create_client(client)
    content = b"downloadable content"
    _upload(client, client_id, "doc-dl", content=content)
    resp = client.get(f"/api/client-documents/{client_id}/doc-dl/download")
    assert resp.status_code == 200
    assert resp.content == content
