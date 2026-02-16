"""AI-powered document verification using Anthropic Claude."""

import logging
from datetime import UTC, datetime
from pathlib import Path

import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import settings
from src.models.client import ClientDocument
from src.services import document_store

logger = logging.getLogger(__name__)

VERIFY_SYSTEM = """\
You are a document verification assistant for Swiss financial licensing applications.

Your job is to examine an uploaded document and determine whether it is a genuine, \
relevant document for the stated purpose.

You will receive:
1. The document's declared purpose (document_id and expected name)
2. The file content (text extracted from the upload)

Assess the document on these criteria:
- **Relevance**: Does the content match the declared document type?
- **Completeness**: Does it appear to be a complete document (not a blank page or stub)?
- **Language**: Is it in an acceptable language (German, French, Italian, or English)?
- **Professionalism**: Does it appear professionally prepared?

Respond with a JSON object (no markdown fences):
{
  "status": "verified" | "rejected",
  "summary": "One-sentence summary of the document content",
  "reason": "Why it was verified or rejected"
}
"""

MAX_TEXT_CHARS = 30_000  # limit text sent to Claude


async def verify_document(doc: ClientDocument, expected_name: str) -> ClientDocument:
    """Run AI verification on an uploaded document. Updates status in DB."""
    file_path = Path(doc.file_path)
    if not file_path.exists():
        return await _mark_error(doc, "File not found on disk")

    # Extract text content
    text = _extract_text(file_path, doc.content_type)
    if not text or len(text.strip()) < 20:
        return await _mark_error(doc, "Could not extract meaningful text from file")

    # Call Claude for verification
    try:
        api_client = anthropic.AsyncAnthropic(
            api_key=settings.anthropic_api_key, timeout=60.0
        )

        @retry(
            stop=stop_after_attempt(2),
            wait=wait_exponential(multiplier=1, min=2, max=8),
            reraise=True,
        )
        async def _verify_with_claude() -> anthropic.types.Message:
            return await api_client.messages.create(
                model=settings.agent_model,
                max_tokens=512,
                system=VERIFY_SYSTEM,
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"Document purpose: {expected_name}\n"
                            f"Document ID: {doc.document_id}\n"
                            f"File name: {doc.file_name}\n\n"
                            f"--- Extracted text (first {MAX_TEXT_CHARS} chars) ---\n"
                            f"{text[:MAX_TEXT_CHARS]}"
                        ),
                    }
                ],
            )

        response = await _verify_with_claude()
        first_block = response.content[0] if response.content else None
        result_text = (
            first_block.text
            if first_block and hasattr(first_block, "text")
            else ""
        )

        import json

        try:
            result = json.loads(result_text)
            status = result.get("status", "error")
            if status not in ("verified", "rejected"):
                status = "error"
            reason = result.get("reason", result_text)
        except json.JSONDecodeError:
            status = "error"
            reason = result_text

        now = datetime.now(UTC).isoformat()
        updated = await document_store.update_status(
            doc.client_id,
            doc.document_id,
            status=status,
            verification_result=reason,
            verified_at=now,
        )
        return updated or doc

    except Exception as exc:
        logger.exception("Verification failed for %s", doc.id)
        return await _mark_error(doc, str(exc))


async def _mark_error(doc: ClientDocument, reason: str) -> ClientDocument:
    updated = await document_store.update_status(
        doc.client_id,
        doc.document_id,
        status="error",
        verification_result=reason,
    )
    return updated or doc


def _extract_text(file_path: Path, content_type: str) -> str:
    """Best-effort text extraction from common file types."""
    suffix = file_path.suffix.lower()

    if suffix == ".pdf":
        try:
            from src.services.document_ingestion import _parse_pdf

            return _parse_pdf(file_path)
        except Exception:
            return ""

    # Plain text types
    if suffix in (".txt", ".md", ".csv") or "text" in content_type:
        try:
            return file_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            return ""

    # For other types, try reading as text
    try:
        return file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""
