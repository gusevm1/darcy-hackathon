"""Health check endpoint with per-service status reporting."""

import logging
import time

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from src.services.db import get_db
from src.services.rag_service import RAGService, get_rag_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["health"])


class ServiceStatus(BaseModel):
    status: str  # "up" | "down"
    latency_ms: float


class HealthResponse(BaseModel):
    status: str  # "healthy" | "degraded" | "unhealthy"
    services: dict[str, ServiceStatus]


async def _check_database() -> ServiceStatus:
    """Check SQLite connectivity with a simple query."""
    start = time.monotonic()
    try:
        db = await get_db()
        try:
            await db.execute("SELECT 1")
        finally:
            await db.close()
        latency = (time.monotonic() - start) * 1000
        return ServiceStatus(status="up", latency_ms=round(latency, 2))
    except Exception:
        latency = (time.monotonic() - start) * 1000
        logger.warning("Database health check failed", exc_info=True)
        return ServiceStatus(status="down", latency_ms=round(latency, 2))


async def _check_qdrant(rag: RAGService) -> ServiceStatus:
    """Check Qdrant connectivity via collection info."""
    start = time.monotonic()
    try:
        qdrant = rag._require_qdrant()  # noqa: SLF001
        await qdrant.get_collections()
        latency = (time.monotonic() - start) * 1000
        return ServiceStatus(status="up", latency_ms=round(latency, 2))
    except Exception:
        latency = (time.monotonic() - start) * 1000
        logger.warning("Qdrant health check failed", exc_info=True)
        return ServiceStatus(status="down", latency_ms=round(latency, 2))


async def _check_openai(rag: RAGService) -> ServiceStatus:
    """Check OpenAI client is configured (lightweight, no API call)."""
    start = time.monotonic()
    try:
        rag._require_openai()  # noqa: SLF001
        latency = (time.monotonic() - start) * 1000
        return ServiceStatus(status="up", latency_ms=round(latency, 2))
    except Exception:
        latency = (time.monotonic() - start) * 1000
        return ServiceStatus(status="down", latency_ms=round(latency, 2))


@router.get("/health")
async def health_check(
    rag: RAGService = Depends(get_rag_service),
) -> HealthResponse:
    """Comprehensive health check with per-service status."""
    db_status = await _check_database()
    qdrant_status = await _check_qdrant(rag)
    openai_status = await _check_openai(rag)

    services = {
        "database": db_status,
        "qdrant": qdrant_status,
        "openai": openai_status,
    }

    # Critical services: database and qdrant
    critical_down = db_status.status == "down" or qdrant_status.status == "down"
    any_down = any(s.status == "down" for s in services.values())

    if critical_down:
        overall = "unhealthy"
    elif any_down:
        overall = "degraded"
    else:
        overall = "healthy"

    return HealthResponse(status=overall, services=services)
