import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI

from src.middleware.auth import require_api_key
from src.middleware.cors import add_cors
from src.routes.client_documents import router as client_documents_router
from src.routes.clients import router as clients_router
from src.routes.consult import router as consult_router
from src.routes.ehp import router as ehp_router
from src.routes.health import router as health_router
from src.routes.kb import router as kb_router
from src.routes.onboard import router as onboard_router
from src.services import client_store, ehp_store, rag_service
from src.services.demo_seeder import seed_demo_documents
from src.services.document_ingestion import (
    seed_client_docs,
    seed_internal_knowledge,
    seed_regulatory_docs,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize services on startup."""
    logging.basicConfig(level=logging.INFO)
    logger.info("Initializing services...")

    await client_store.init_db()
    logger.info("Client database initialized")

    await client_store.seed_demo_client()
    await client_store.seed_fintech_client()
    logger.info("Demo clients seeded")

    await seed_demo_documents()
    logger.info("Demo documents seeded")

    await ehp_store.seed_demo_ehp_comments()
    logger.info("Demo EHP comments seeded")

    try:
        await rag_service.init()
        logger.info("RAG service initialized")
        await seed_regulatory_docs()
        logger.info("Regulatory docs seeded")
        await seed_client_docs()
        logger.info("Client documents indexed")
        await seed_internal_knowledge()
        logger.info("Internal knowledge seeded")
    except Exception:
        logger.exception("Failed to initialize RAG service (Qdrant may not be running)")

    # Store default RAGService instance on app state for DI
    app.state.rag_service = rag_service._default_instance  # noqa: SLF001

    yield


app = FastAPI(title="FINMA Comply API", version="0.3.0", lifespan=lifespan)

add_cors(app)

# Health check at root (no versioning)
app.include_router(health_router)

# API v1 (all require API key when configured)
v1_router = APIRouter(prefix="/v1", dependencies=[require_api_key])
v1_router.include_router(onboard_router)
v1_router.include_router(clients_router)
v1_router.include_router(kb_router)
v1_router.include_router(consult_router)
v1_router.include_router(client_documents_router)
v1_router.include_router(ehp_router)
app.include_router(v1_router)

# Backwards-compatible unversioned routes (also require API key)
compat_router = APIRouter(dependencies=[require_api_key])
compat_router.include_router(onboard_router)
compat_router.include_router(clients_router)
compat_router.include_router(kb_router)
compat_router.include_router(consult_router)
compat_router.include_router(client_documents_router)
compat_router.include_router(ehp_router)
app.include_router(compat_router)
