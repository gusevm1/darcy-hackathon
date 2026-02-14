"""RAG service: embedding, indexing, and hybrid search.

Uses Qdrant + OpenAI embeddings.
"""

import hashlib
import logging
import uuid

from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)
from rank_bm25 import BM25Okapi

from src.config import settings

logger = logging.getLogger(__name__)

_qdrant: AsyncQdrantClient | None = None
_openai: AsyncOpenAI | None = None
_bm25_corpus: list[dict[str, str]] = []


async def init() -> None:
    """Connect to Qdrant and init OpenAI client."""
    global _qdrant, _openai
    _qdrant = AsyncQdrantClient(url=settings.qdrant_url)
    _openai = AsyncOpenAI(api_key=settings.openai_api_key)

    collections = await _qdrant.get_collections()
    names = [c.name for c in collections.collections]
    if settings.qdrant_collection not in names:
        await _qdrant.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(
                size=settings.embedding_dimensions,
                distance=Distance.COSINE,
            ),
        )
        logger.info("Created Qdrant collection: %s", settings.qdrant_collection)


async def embed(text: str) -> list[float]:
    """Generate embedding via OpenAI API."""
    assert _openai is not None
    resp = await _openai.embeddings.create(
        model=settings.embedding_model,
        input=text,
        dimensions=settings.embedding_dimensions,
    )
    return resp.data[0].embedding


def _chunk_text(
    text: str, max_tokens: int = 512, overlap_tokens: int = 50
) -> list[str]:
    """Split text into overlapping chunks by paragraph boundaries."""
    paragraphs = text.split("\n\n")
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        para_len = len(para.split())
        if current_len + para_len > max_tokens and current:
            chunks.append("\n\n".join(current))
            # Keep overlap
            overlap: list[str] = []
            overlap_len = 0
            for p in reversed(current):
                p_len = len(p.split())
                if overlap_len + p_len > overlap_tokens:
                    break
                overlap.insert(0, p)
                overlap_len += p_len
            current = overlap
            current_len = overlap_len
        current.append(para)
        current_len += para_len

    if current:
        chunks.append("\n\n".join(current))

    return chunks if chunks else [text]


def content_hash(text: str) -> str:
    """Generate a content hash for deduplication."""
    return hashlib.sha256(text.encode()).hexdigest()[:16]


async def ingest_document(
    text: str,
    doc_id: str,
    title: str,
    source: str,
) -> int:
    """Chunk, embed, and store a document. Returns number of chunks."""
    assert _qdrant is not None
    chunks = _chunk_text(text)
    points: list[PointStruct] = []

    for i, chunk in enumerate(chunks):
        vector = await embed(chunk)
        point_id = str(uuid.uuid4())
        points.append(
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "doc_id": doc_id,
                    "title": title,
                    "source": source,
                    "chunk_index": i,
                    "text": chunk,
                    "content_hash": content_hash(text),
                },
            )
        )

    if points:
        await _qdrant.upsert(collection_name=settings.qdrant_collection, points=points)
        # Update BM25 corpus
        for p in points:
            _bm25_corpus.append(
                {"id": str(p.id), "text": str(p.payload["text"])}  # type: ignore[index]
            )

    logger.info("Ingested '%s': %d chunks", title, len(points))
    return len(points)


async def search(query: str, top_k: int = 5) -> list[dict[str, object]]:
    """Hybrid search: Qdrant vector + BM25 lexical with reciprocal rank fusion."""
    assert _qdrant is not None
    query_vector = await embed(query)

    # Vector search
    vector_results = await _qdrant.query_points(
        collection_name=settings.qdrant_collection,
        query=query_vector,
        limit=top_k * 2,
        with_payload=True,
    )

    # BM25 lexical search
    bm25_results: list[dict[str, object]] = []
    if _bm25_corpus:
        tokenized = [doc["text"].lower().split() for doc in _bm25_corpus]
        bm25 = BM25Okapi(tokenized)
        scores = bm25.get_scores(query.lower().split())
        scored = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)[
            : top_k * 2
        ]
        for idx, score in scored:
            if score > 0:
                bm25_results.append(
                    {"id": _bm25_corpus[idx]["id"], "score": float(score)}
                )

    # Reciprocal rank fusion
    rrf_scores: dict[str, float] = {}
    rrf_payloads: dict[str, dict[str, object]] = {}

    k = 60  # RRF constant
    for rank, point in enumerate(vector_results.points):
        pid = str(point.id)
        rrf_scores[pid] = rrf_scores.get(pid, 0) + 1.0 / (k + rank + 1)
        if point.payload:
            rrf_payloads[pid] = dict(point.payload)

    for rank, item in enumerate(bm25_results):
        pid = str(item["id"])
        rrf_scores[pid] = rrf_scores.get(pid, 0) + 1.0 / (k + rank + 1)

    sorted_ids = sorted(rrf_scores, key=lambda x: rrf_scores[x], reverse=True)[:top_k]

    results: list[dict[str, object]] = []
    for pid in sorted_ids:
        payload = rrf_payloads.get(pid, {})
        results.append(
            {
                "text": payload.get("text", ""),
                "title": payload.get("title", ""),
                "source": payload.get("source", ""),
                "doc_id": payload.get("doc_id", ""),
                "chunk_index": payload.get("chunk_index", 0),
                "score": rrf_scores[pid],
            }
        )

    return results


async def delete_document(doc_id: str) -> int:
    """Delete all chunks for a document. Returns count of deleted points."""
    assert _qdrant is not None
    await _qdrant.delete(
        collection_name=settings.qdrant_collection,
        points_selector=Filter(
            must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
        ),
    )
    # Remove from BM25 corpus
    global _bm25_corpus
    _bm25_corpus = [c for c in _bm25_corpus if c.get("doc_id") != doc_id]
    logger.info("Deleted document: %s", doc_id)
    return 0  # Qdrant delete doesn't return count


async def list_documents() -> list[dict[str, str]]:
    """List all unique documents in the collection."""
    assert _qdrant is not None
    docs: dict[str, dict[str, str]] = {}

    offset = None
    while True:
        result = await _qdrant.scroll(
            collection_name=settings.qdrant_collection,
            limit=100,
            offset=offset,
            with_payload=True,
        )
        points, next_offset = result
        for point in points:
            if point.payload:
                did = str(point.payload.get("doc_id", ""))
                if did and did not in docs:
                    docs[did] = {
                        "doc_id": did,
                        "title": str(point.payload.get("title", "")),
                        "source": str(point.payload.get("source", "")),
                    }
        if next_offset is None:
            break
        offset = next_offset

    return list(docs.values())


async def rebuild_bm25_corpus() -> None:
    """Rebuild in-memory BM25 corpus from Qdrant."""
    assert _qdrant is not None
    global _bm25_corpus
    _bm25_corpus = []

    offset = None
    while True:
        result = await _qdrant.scroll(
            collection_name=settings.qdrant_collection,
            limit=100,
            offset=offset,
            with_payload=True,
        )
        points, next_offset = result
        for point in points:
            if point.payload:
                _bm25_corpus.append(
                    {"id": str(point.id), "text": str(point.payload.get("text", ""))}
                )
        if next_offset is None:
            break
        offset = next_offset

    logger.info("Rebuilt BM25 corpus: %d entries", len(_bm25_corpus))
