"""Document ingestion: parse files and seed regulatory docs into the knowledge base."""

import logging
from pathlib import Path

from src.models.client import ClientDocument
from src.services import document_store, rag_service

logger = logging.getLogger(__name__)

REGULATORY_DOCS_DIR = Path(__file__).parent.parent / "data" / "regulatory_docs"
INTERNAL_KNOWLEDGE_DIR = Path(__file__).parent.parent / "data" / "internal_knowledge"

# Category mapping for internal knowledge display names
INTERNAL_CATEGORIES: dict[str, str] = {
    "email_aml_rejection_resolution": "Email Archives",
    "email_capital_proof_delay": "Email Archives",
    "finma_partner_contacts": "FINMA Contacts",
    "process_template_board_cv_checklist": "Process Templates",
    "process_template_application_timeline": "Process Templates",
}


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


async def ingest_client_document(doc: ClientDocument) -> int:
    """Ingest an uploaded client document into the knowledge base."""
    path = Path(doc.file_path)
    if not path.exists():
        logger.warning("File not found for client doc: %s", doc.file_path)
        return 0
    text = _parse_file(path)
    doc_id = f"client-{doc.client_id}-{doc.document_id}"
    title = doc.document_id.replace("-", " ").title()
    source = f"client:{doc.client_id}/{doc.file_name}"
    return await rag_service.ingest_document(
        text, doc_id, title, source, client_id=doc.client_id
    )


async def seed_internal_knowledge() -> None:
    """Seed internal consultant knowledge into the KB."""
    if not INTERNAL_KNOWLEDGE_DIR.exists():
        logger.warning("Internal knowledge dir not found: %s", INTERNAL_KNOWLEDGE_DIR)
        return

    existing = await rag_service.list_documents()
    existing_ids = {d["doc_id"] for d in existing}

    for path in sorted(INTERNAL_KNOWLEDGE_DIR.glob("*.txt")):
        stem = path.stem
        doc_id = f"internal-{stem}"
        if doc_id in existing_ids:
            logger.info("Already indexed: %s", path.name)
            continue

        text = _parse_file(path)
        title = stem.replace("_", " ").title()
        category = INTERNAL_CATEGORIES.get(stem, "General")
        source = f"internal:{category}"

        await rag_service.ingest_document(text, doc_id, title, source)
        logger.info("Seeded internal knowledge: %s", path.name)

    await rag_service.rebuild_bm25_corpus()
    logger.info("Internal knowledge seeding complete")


async def seed_client_docs() -> None:
    """Index any uploaded client documents that aren't yet in Qdrant."""
    existing = await rag_service.list_documents()
    existing_ids = {d["doc_id"] for d in existing}

    all_client_ids = await document_store.list_all_client_ids()
    for client_id in all_client_ids:
        docs = await document_store.list_documents(client_id)
        for doc in docs:
            doc_id = f"client-{doc.client_id}-{doc.document_id}"
            if doc_id in existing_ids:
                continue
            count = await ingest_client_document(doc)
            if count:
                logger.info("Seeded: %s (%d chunks)", doc_id, count)

    await rag_service.rebuild_bm25_corpus()
