"""RAG service: embedding, indexing, and hybrid search.

Uses Qdrant + OpenAI embeddings.
"""

import hashlib
import logging
import uuid

from fastapi import Request
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
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import settings

logger = logging.getLogger(__name__)


class RAGServiceNotInitializedError(RuntimeError):
    """Raised when RAG service is used before init() is called."""

    def __init__(self, component: str = "RAG service") -> None:
        super().__init__(
            f"{component} is not initialized. "
            "Ensure init() has been called and Qdrant is running."
        )


class RAGService:
    """Encapsulates Qdrant + OpenAI embedding state for RAG operations."""

    def __init__(self) -> None:
        self._qdrant: AsyncQdrantClient | None = None
        self._openai: AsyncOpenAI | None = None
        self._bm25_corpus: list[dict[str, str]] = []

    def _require_qdrant(self) -> AsyncQdrantClient:
        if self._qdrant is None:
            raise RAGServiceNotInitializedError("Qdrant client")
        return self._qdrant

    def _require_openai(self) -> AsyncOpenAI:
        if self._openai is None:
            raise RAGServiceNotInitializedError("OpenAI client")
        return self._openai

    async def init(self) -> None:
        """Connect to Qdrant and init OpenAI client."""
        self._qdrant = AsyncQdrantClient(url=settings.qdrant_url)
        self._openai = AsyncOpenAI(api_key=settings.openai_api_key)

        collections = await self._qdrant.get_collections()
        names = [c.name for c in collections.collections]
        if settings.qdrant_collection not in names:
            await self._qdrant.create_collection(
                collection_name=settings.qdrant_collection,
                vectors_config=VectorParams(
                    size=settings.embedding_dimensions,
                    distance=Distance.COSINE,
                ),
            )
            logger.info(
                "Created Qdrant collection: %s", settings.qdrant_collection
            )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        reraise=True,
    )
    async def embed(self, text: str) -> list[float]:
        """Generate embedding via OpenAI API."""
        openai = self._require_openai()
        resp = await openai.embeddings.create(
            model=settings.embedding_model,
            input=text,
            dimensions=settings.embedding_dimensions,
            timeout=30,
        )
        return resp.data[0].embedding

    async def ingest_document(
        self,
        text: str,
        doc_id: str,
        title: str,
        source: str,
        client_id: str | None = None,
    ) -> int:
        """Chunk, embed, and store a document. Returns number of chunks."""
        qdrant = self._require_qdrant()
        chunks = _chunk_text(text)
        points: list[PointStruct] = []

        for i, chunk in enumerate(chunks):
            vector = await self.embed(chunk)
            point_id = str(uuid.uuid4())
            points.append(
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={
                        "doc_id": doc_id,
                        "title": title,
                        "source": source,
                        "client_id": client_id,
                        "chunk_index": i,
                        "text": chunk,
                        "content_hash": content_hash(text),
                    },
                )
            )

        if points:
            await qdrant.upsert(
                collection_name=settings.qdrant_collection, points=points
            )
            # Update BM25 corpus
            for p in points:
                if p.payload is not None:
                    self._bm25_corpus.append(
                        {"id": str(p.id), "text": str(p.payload["text"])}
                    )

        logger.info("Ingested '%s': %d chunks", title, len(points))
        return len(points)

    async def search(
        self, query: str, top_k: int = 5
    ) -> list[dict[str, object]]:
        """Hybrid search: Qdrant vector + BM25 lexical with reciprocal rank fusion."""
        qdrant = self._require_qdrant()
        query_vector = await self.embed(query)

        # Vector search
        vector_results = await qdrant.query_points(
            collection_name=settings.qdrant_collection,
            query=query_vector,
            limit=top_k * 2,
            with_payload=True,
        )

        # BM25 lexical search
        bm25_results: list[dict[str, object]] = []
        if self._bm25_corpus:
            tokenized = [
                doc["text"].lower().split() for doc in self._bm25_corpus
            ]
            bm25 = BM25Okapi(tokenized)
            scores = bm25.get_scores(query.lower().split())
            scored = sorted(
                enumerate(scores), key=lambda x: x[1], reverse=True
            )[: top_k * 2]
            for idx, score in scored:
                if score > 0:
                    bm25_results.append(
                        {
                            "id": self._bm25_corpus[idx]["id"],
                            "score": float(score),
                        }
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

        sorted_ids = sorted(
            rrf_scores, key=lambda x: rrf_scores[x], reverse=True
        )[:top_k]

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

    async def delete_document(self, doc_id: str) -> int:
        """Delete all chunks for a document. Returns count of deleted points."""
        qdrant = self._require_qdrant()
        await qdrant.delete(
            collection_name=settings.qdrant_collection,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="doc_id", match=MatchValue(value=doc_id)
                    )
                ]
            ),
        )
        # Remove from BM25 corpus
        self._bm25_corpus = [
            c for c in self._bm25_corpus if c.get("doc_id") != doc_id
        ]
        logger.info("Deleted document: %s", doc_id)
        return 0  # Qdrant delete doesn't return count

    async def list_documents(self) -> list[dict[str, str]]:
        """List all unique documents in the collection."""
        qdrant = self._require_qdrant()
        docs: dict[str, dict[str, str]] = {}

        offset = None
        while True:
            result = await qdrant.scroll(
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

    async def rebuild_bm25_corpus(self) -> None:
        """Rebuild in-memory BM25 corpus from Qdrant."""
        qdrant = self._require_qdrant()
        self._bm25_corpus = []

        offset = None
        while True:
            result = await qdrant.scroll(
                collection_name=settings.qdrant_collection,
                limit=100,
                offset=offset,
                with_payload=True,
            )
            points, next_offset = result
            for point in points:
                if point.payload:
                    self._bm25_corpus.append(
                        {
                            "id": str(point.id),
                            "text": str(point.payload.get("text", "")),
                        }
                    )
            if next_offset is None:
                break
            offset = next_offset

        logger.info("Rebuilt BM25 corpus: %d entries", len(self._bm25_corpus))


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


# --- Module-level singleton for backward compatibility ---
_default_instance = RAGService()

# Re-export instance methods as module-level functions so existing
# imports like ``from src.services import rag_service; rag_service.search(...)``
# continue to work unchanged.
init = _default_instance.init
embed = _default_instance.embed
ingest_document = _default_instance.ingest_document
search = _default_instance.search
delete_document = _default_instance.delete_document
list_documents = _default_instance.list_documents
rebuild_bm25_corpus = _default_instance.rebuild_bm25_corpus


def get_rag_service(request: Request) -> RAGService:
    """FastAPI dependency that returns the RAGService from app state."""
    svc: RAGService | None = getattr(request.app.state, "rag_service", None)
    if svc is None:
        return _default_instance
    return svc
