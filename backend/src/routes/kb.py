"""Knowledge base endpoints: search and document management."""

from fastapi import APIRouter, HTTPException, UploadFile
from pydantic import BaseModel

from src.services import rag_service

router = APIRouter(prefix="/api/kb", tags=["knowledge-base"])


class KBSearchRequest(BaseModel):
    query: str
    top_k: int = 5


class KBSearchResult(BaseModel):
    text: str
    title: str
    source: str
    doc_id: str
    score: float


class KBDocument(BaseModel):
    doc_id: str
    title: str
    source: str


@router.post("/search")
async def search_kb(body: KBSearchRequest) -> list[KBSearchResult]:
    """Search the knowledge base."""
    results = await rag_service.search(body.query, body.top_k)
    return [
        KBSearchResult(
            text=str(r.get("text", "")),
            title=str(r.get("title", "")),
            source=str(r.get("source", "")),
            doc_id=str(r.get("doc_id", "")),
            score=float(str(r.get("score", 0))),
        )
        for r in results
    ]


@router.post("/documents")
async def upload_document(
    file: UploadFile,
    title: str = "",
    source: str = "",
) -> dict[str, object]:
    """Upload a document to the knowledge base."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename")
    content = await file.read()
    text = content.decode("utf-8")
    doc_id = rag_service.content_hash(text)
    if not title:
        title = file.filename.rsplit(".", 1)[0].replace("_", " ").title()
    if not source:
        source = file.filename
    chunks = await rag_service.ingest_document(text, doc_id, title, source)
    return {"doc_id": doc_id, "title": title, "chunks": chunks}


@router.get("/documents")
async def list_documents() -> list[KBDocument]:
    """List all indexed documents."""
    docs = await rag_service.list_documents()
    return [
        KBDocument(
            doc_id=d["doc_id"],
            title=d["title"],
            source=d["source"],
        )
        for d in docs
    ]


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str) -> dict[str, str]:
    """Remove a document and its chunks from the knowledge base."""
    await rag_service.delete_document(doc_id)
    return {"status": "deleted", "doc_id": doc_id}
