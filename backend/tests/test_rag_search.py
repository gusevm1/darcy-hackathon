"""Tests for RAG search endpoint and RAGService unit tests."""

from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from src.services.rag_service import (
    RAGService,
    RAGServiceNotInitializedError,
    _chunk_text,
    content_hash,
)

# --- RAGService unit tests ---


class TestRAGServiceConstructor:
    def test_init_has_none_clients(self) -> None:
        svc = RAGService()
        assert svc._qdrant is None  # noqa: SLF001
        assert svc._openai is None  # noqa: SLF001

    def test_init_has_empty_bm25_corpus(self) -> None:
        svc = RAGService()
        assert svc._bm25_corpus == []  # noqa: SLF001


class TestRequireClients:
    def test_require_qdrant_raises_when_not_initialized(self) -> None:
        svc = RAGService()
        with pytest.raises(RAGServiceNotInitializedError, match="Qdrant client"):
            svc._require_qdrant()  # noqa: SLF001

    def test_require_openai_raises_when_not_initialized(self) -> None:
        svc = RAGService()
        with pytest.raises(RAGServiceNotInitializedError, match="OpenAI client"):
            svc._require_openai()  # noqa: SLF001

    def test_error_message_includes_init_hint(self) -> None:
        svc = RAGService()
        with pytest.raises(RAGServiceNotInitializedError, match="init()"):
            svc._require_qdrant()  # noqa: SLF001


class TestContentHash:
    def test_deterministic(self) -> None:
        assert content_hash("hello world") == content_hash("hello world")

    def test_returns_16_char_hex(self) -> None:
        h = content_hash("test input")
        assert len(h) == 16
        assert all(c in "0123456789abcdef" for c in h)

    def test_different_inputs_different_hashes(self) -> None:
        assert content_hash("aaa") != content_hash("bbb")


class TestChunkText:
    def test_short_text_returns_single_chunk(self) -> None:
        text = "Short paragraph here."
        chunks = _chunk_text(text)
        assert len(chunks) == 1
        assert chunks[0] == text

    def test_splits_long_text(self) -> None:
        # Create text with multiple paragraphs exceeding max_tokens
        paragraphs = [f"Word{i} " * 100 for i in range(10)]
        text = "\n\n".join(paragraphs)
        chunks = _chunk_text(text, max_tokens=200, overlap_tokens=20)
        assert len(chunks) > 1

    def test_overlap_preserves_context(self) -> None:
        # Build paragraphs that force a split
        p1 = "alpha " * 60  # ~60 words
        p2 = "beta " * 60
        p3 = "gamma " * 60
        text = f"{p1.strip()}\n\n{p2.strip()}\n\n{p3.strip()}"
        chunks = _chunk_text(text, max_tokens=80, overlap_tokens=50)
        assert len(chunks) >= 2
        # Overlap means second chunk should contain content from near the end of first
        if len(chunks) >= 2:
            assert "beta" in chunks[1]

    def test_empty_text_returns_original(self) -> None:
        chunks = _chunk_text("")
        assert chunks == [""]

    def test_whitespace_only_paragraphs_skipped(self) -> None:
        text = "Hello world.\n\n   \n\nGoodbye world."
        chunks = _chunk_text(text)
        assert len(chunks) == 1
        assert "Hello world." in chunks[0]
        assert "Goodbye world." in chunks[0]


# --- HTTP endpoint tests ---


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
