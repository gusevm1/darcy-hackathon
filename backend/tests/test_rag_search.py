"""Tests for RAG search endpoint with mocked external services."""

from typing import Any
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient


def _fake_search_results() -> list[dict[str, Any]]:
    return [
        {
            "text": "Banking Act Art 3...",
            "title": "BankA",
            "source": "finma.ch",
            "doc_id": "banka-001",
            "chunk_index": 0,
            "score": 0.032,
        }
    ]


def test_search_kb(client: TestClient) -> None:
    with patch.object(
        _get_default_instance(),
        "search",
        new_callable=AsyncMock,
        return_value=_fake_search_results(),
    ):
        resp = client.post(
            "/api/kb/search",
            json={"query": "banking license requirements", "top_k": 3},
        )
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) == 1
    assert results[0]["title"] == "BankA"
    assert results[0]["score"] > 0


def test_search_kb_empty_results(client: TestClient) -> None:
    with patch.object(
        _get_default_instance(),
        "search",
        new_callable=AsyncMock,
        return_value=[],
    ):
        resp = client.post(
            "/api/kb/search", json={"query": "nonexistent topic"}
        )
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_kb_documents(client: TestClient) -> None:
    with patch.object(
        _get_default_instance(),
        "list_documents",
        new_callable=AsyncMock,
        return_value=[
            {"doc_id": "d1", "title": "Doc One", "source": "src1"},
            {"doc_id": "d2", "title": "Doc Two", "source": "src2"},
        ],
    ):
        resp = client.get("/api/kb/documents")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2


def _get_default_instance() -> Any:
    from src.services.rag_service import _default_instance

    return _default_instance
