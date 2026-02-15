"""Client document upload, listing, download, delete, and verification endpoints."""

from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel

from src.models.client import ClientDocument
from src.services import document_store
from src.services.document_verifier import verify_document

router = APIRouter(prefix="/api/client-documents", tags=["client-documents"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


class DocumentResponse(BaseModel):
    id: str
    client_id: str
    document_id: str
    file_name: str
    content_type: str
    file_size: int
    status: str
    verification_result: str | None
    uploaded_at: str
    verified_at: str | None


class DeleteResponse(BaseModel):
    status: str
    document_id: str


def _doc_to_response(doc: ClientDocument) -> DocumentResponse:
    return DocumentResponse(
        id=doc.id,
        client_id=doc.client_id,
        document_id=doc.document_id,
        file_name=doc.file_name,
        content_type=doc.content_type,
        file_size=doc.file_size,
        status=doc.status,
        verification_result=doc.verification_result,
        uploaded_at=doc.uploaded_at.isoformat(),
        verified_at=doc.verified_at.isoformat() if doc.verified_at else None,
    )


@router.post("/{client_id}/upload")
async def upload_document(
    client_id: str,
    file: UploadFile,
    document_id: str = "",
) -> DocumentResponse:
    """Upload a document for a client's license application."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    if not document_id:
        raise HTTPException(status_code=400, detail="document_id is required")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 50 MB)")

    doc = await document_store.store_file(
        client_id=client_id,
        document_id=document_id,
        file_name=file.filename,
        content=content,
        content_type=file.content_type or "",
    )
    return _doc_to_response(doc)


@router.get("/{client_id}")
async def list_documents(client_id: str) -> list[DocumentResponse]:
    """List all uploaded documents for a client."""
    docs = await document_store.list_documents(client_id)
    return [_doc_to_response(d) for d in docs]


@router.get("/{client_id}/{document_id}")
async def get_document(client_id: str, document_id: str) -> DocumentResponse:
    """Get a single document's metadata."""
    doc = await document_store.get_document(client_id, document_id)
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return _doc_to_response(doc)


@router.delete("/{client_id}/{document_id}")
async def delete_document(client_id: str, document_id: str) -> DeleteResponse:
    """Delete an uploaded document."""
    deleted = await document_store.delete_document(client_id, document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    return DeleteResponse(status="deleted", document_id=document_id)


@router.get("/{client_id}/{document_id}/download")
async def download_document(client_id: str, document_id: str) -> FileResponse:
    """Download an uploaded document file."""
    doc = await document_store.get_document(client_id, document_id)
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = Path(doc.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        path=str(file_path),
        filename=doc.file_name,
        media_type=doc.content_type or "application/octet-stream",
    )


@router.post("/{client_id}/{document_id}/verify")
async def verify_doc(client_id: str, document_id: str) -> DocumentResponse:
    """Trigger AI verification of an uploaded document."""
    doc = await document_store.get_document(client_id, document_id)
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    updated = await verify_document(doc, expected_name=document_id)
    return _doc_to_response(updated)
