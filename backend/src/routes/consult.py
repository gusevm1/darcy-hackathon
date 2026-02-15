"""Consultant interface endpoints."""

from collections.abc import AsyncGenerator
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from starlette.requests import Request

from src.models.client import GapAnalysis, NextStep
from src.services import client_store
from src.services.consultant_agent import run_consultant_turn
from src.services.gap_analyzer import analyze_gaps

router = APIRouter(prefix="/api/consult", tags=["consult"])


class ConsultChatRequest(BaseModel):
    client_id: str | None = None
    message: str
    conversation_history: list[dict[str, Any]] = []
    client_context: dict[str, Any] | None = None


class NextStepsResponse(BaseModel):
    client_id: str
    pathway: str
    next_steps: list[NextStep]
    critical_blockers: list[str]


@router.post("/chat")
async def consult_chat(
    request: Request, body: ConsultChatRequest
) -> EventSourceResponse:
    """Stream a consultant conversation turn. Optionally scoped to a client."""
    # Resolve client_id: only keep it if the client exists in the backend DB.
    resolved_client_id = body.client_id
    if body.client_id:
        client = await client_store.get_client(body.client_id)
        if client is None:
            resolved_client_id = None

    async def event_generator() -> AsyncGenerator[str, None]:
        async for chunk in run_consultant_turn(
            body.message,
            body.conversation_history,
            resolved_client_id,
            body.client_context,
        ):
            if await request.is_disconnected():
                break
            yield chunk

    return EventSourceResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/analyze-gaps/{client_id}")
async def consult_analyze_gaps(client_id: str) -> GapAnalysis:
    """Run a structured gap analysis for a client."""
    client = await client_store.get_client(client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return analyze_gaps(client)


@router.post("/next-steps/{client_id}")
async def consult_next_steps(client_id: str) -> NextStepsResponse:
    """Get prioritized next steps for a client."""
    client = await client_store.get_client(client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    analysis = analyze_gaps(client)
    return NextStepsResponse(
        client_id=client_id,
        pathway=analysis.pathway,
        next_steps=analysis.next_steps,
        critical_blockers=analysis.critical_blockers,
    )
