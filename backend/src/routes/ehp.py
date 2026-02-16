"""EHP (Electronic Hub Platform) comment endpoints."""

from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.models.ehp import EHPComment, EHPCommentCreate
from src.services import document_store, ehp_store
from src.services.document_ingestion import _parse_file
from src.services.ehp_generator import generate_ehp_comments

router = APIRouter(prefix="/api/ehp", tags=["ehp"])


@router.get("/{client_id}/{document_id}")
async def list_comments(client_id: str, document_id: str) -> list[EHPComment]:
    """List all EHP comments for a client + document."""
    return await ehp_store.list_comments(client_id, document_id)


@router.post("/{client_id}/{document_id}")
async def add_comment(
    client_id: str, document_id: str, body: EHPCommentCreate
) -> EHPComment:
    """Add a new EHP comment."""
    return await ehp_store.add_comment(
        client_id=client_id,
        document_id=document_id,
        author=body.author,
        role=body.role,
        content=body.content,
    )


@router.patch("/{comment_id}/resolve")
async def toggle_resolve(comment_id: str) -> EHPComment:
    """Toggle the resolved status of a comment."""
    comment = await ehp_store.toggle_resolved(comment_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


class GenerateRequest(BaseModel):
    document_name: str = ""
    document_description: str = ""


@router.post("/{client_id}/{document_id}/generate")
async def generate_comments(
    client_id: str, document_id: str, body: GenerateRequest | None = None
) -> list[EHPComment]:
    """AI-generate realistic EHP review comments for a document."""
    doc_name = body.document_name if body else document_id
    doc_desc = body.document_description if body else ""

    # Retrieve actual document text for context-aware generation
    document_text: str | None = None
    doc = await document_store.get_document(client_id, document_id)
    if doc:
        file_path = Path(doc.file_path)
        if file_path.exists():
            try:
                document_text = _parse_file(file_path)
            except Exception:
                pass  # Fall back to generation without document text

    return await generate_ehp_comments(
        client_id=client_id,
        document_id=document_id,
        document_name=doc_name,
        document_description=doc_desc,
        document_text=document_text,
    )
