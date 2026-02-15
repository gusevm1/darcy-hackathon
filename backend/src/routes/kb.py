"""Knowledge base endpoints: search and document management."""

import tempfile
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query, UploadFile
from pydantic import BaseModel

from src.models.pagination import PaginatedResponse
from src.services import rag_service
from src.services.document_ingestion import _parse_pdf

router = APIRouter(prefix="/api/kb", tags=["knowledge-base"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
ALLOWED_EXTENSIONS = {".txt", ".md", ".pdf", ".csv"}


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


class DocumentUploadResponse(BaseModel):
    doc_id: str
    title: str
    chunks: int


class DocumentDeleteResponse(BaseModel):
    status: str
    doc_id: str


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
) -> DocumentUploadResponse:
    """Upload a document to the knowledge base."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. "
            f"Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 50 MB)")

    if ext == ".pdf":
        tmp_path: Path | None = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(content)
                tmp.flush()
                tmp_path = Path(tmp.name)
            text = _parse_pdf(tmp_path)
        finally:
            if tmp_path is not None:
                tmp_path.unlink(missing_ok=True)
    else:
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError as err:
            raise HTTPException(
                status_code=400, detail="File is not valid UTF-8 text"
            ) from err

    doc_id = rag_service.content_hash(text)
    if not title:
        title = file.filename.rsplit(".", 1)[0].replace("_", " ").title()
    if not source:
        source = file.filename
    chunks = await rag_service.ingest_document(text, doc_id, title, source)
    return DocumentUploadResponse(doc_id=doc_id, title=title, chunks=chunks)


@router.get("/documents")
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> PaginatedResponse[KBDocument]:
    """List all indexed documents."""
    docs = await rag_service.list_documents()
    total = len(docs)
    page = docs[skip : skip + limit]
    items = [
        KBDocument(
            doc_id=d["doc_id"],
            title=d["title"],
            source=d["source"],
        )
        for d in page
    ]
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str) -> DocumentDeleteResponse:
    """Remove a document and its chunks from the knowledge base."""
    await rag_service.delete_document(doc_id)
    return DocumentDeleteResponse(status="deleted", doc_id=doc_id)
