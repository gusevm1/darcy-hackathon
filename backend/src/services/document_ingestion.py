"""Document ingestion: parse files and seed regulatory docs into the knowledge base."""

import logging
from pathlib import Path

from src.services import rag_service

logger = logging.getLogger(__name__)

REGULATORY_DOCS_DIR = Path(__file__).parent.parent / "data" / "regulatory_docs"


def _parse_file(path: Path) -> str:
    """Read a text or PDF file and return its content as plain text."""
    if path.suffix.lower() == ".pdf":
        return _parse_pdf(path)
    return path.read_text(encoding="utf-8")


def _parse_pdf(path: Path) -> str:
    """Extract text from a PDF file using pypdf."""
    from pypdf import PdfReader

    reader = PdfReader(path)
    pages: list[str] = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    return "\n\n".join(pages)


async def ingest_file(
    path: Path,
    title: str,
    source: str,
    doc_id: str | None = None,
) -> int:
    """Parse and ingest a file into the knowledge base."""
    text = _parse_file(path)
    if doc_id is None:
        doc_id = rag_service.content_hash(text)
    return await rag_service.ingest_document(text, doc_id, title, source)


async def seed_regulatory_docs() -> None:
    """Check and ingest any missing regulatory docs from the data directory."""
    if not REGULATORY_DOCS_DIR.exists():
        logger.warning("Regulatory docs directory not found: %s", REGULATORY_DOCS_DIR)
        return

    existing = await rag_service.list_documents()
    existing_ids = {d["doc_id"] for d in existing}

    for path in sorted(
        [*REGULATORY_DOCS_DIR.glob("*.txt"), *REGULATORY_DOCS_DIR.glob("*.pdf")]
    ):
        text = _parse_file(path)
        doc_id = rag_service.content_hash(text)

        if doc_id in existing_ids:
            logger.info("Already indexed: %s", path.name)
            continue

        title = path.stem.replace("_", " ").title()
        await ingest_file(path, title, path.name, doc_id)
        logger.info("Seeded: %s", path.name)

    # Rebuild BM25 corpus after seeding
    await rag_service.rebuild_bm25_corpus()
    logger.info("Regulatory docs seeding complete")
