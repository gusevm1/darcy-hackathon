import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI

from src.middleware.cors import add_cors
from src.routes.client_documents import router as client_documents_router
from src.routes.clients import router as clients_router
from src.routes.consult import router as consult_router
from src.routes.health import router as health_router
from src.routes.kb import router as kb_router
from src.routes.onboard import router as onboard_router
from src.services import client_store, rag_service
from src.services.document_ingestion import seed_regulatory_docs

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize services on startup."""
    logging.basicConfig(level=logging.INFO)
    logger.info("Initializing services...")

    await client_store.init_db()
    logger.info("Client database initialized")

    try:
        await rag_service.init()
        logger.info("RAG service initialized")
        await seed_regulatory_docs()
        logger.info("Regulatory docs seeded")
    except Exception:
        logger.exception("Failed to initialize RAG service (Qdrant may not be running)")

    yield


app = FastAPI(title="Darcy Hackathon API", version="0.2.0", lifespan=lifespan)

add_cors(app)

# Health check at root (no versioning)
app.include_router(health_router)

# API v1
v1_router = APIRouter(prefix="/v1")
v1_router.include_router(onboard_router)
v1_router.include_router(clients_router)
v1_router.include_router(kb_router)
v1_router.include_router(consult_router)
v1_router.include_router(client_documents_router)
app.include_router(v1_router)

# Backwards-compatible unversioned routes
app.include_router(onboard_router)
app.include_router(clients_router)
app.include_router(kb_router)
app.include_router(consult_router)
app.include_router(client_documents_router)
