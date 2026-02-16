"""Consultant interface endpoints."""

import json as _json
from collections.abc import AsyncGenerator
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from starlette.requests import Request

from src.models.chat_session import ChatSession
from src.models.client import GapAnalysis, NextStep
from src.services import chat_store, client_store
from src.services.consultant_agent import run_consultant_turn
from src.services.gap_analyzer import analyze_gaps

router = APIRouter(prefix="/api/consult", tags=["consult"])


class ConsultChatRequest(BaseModel):
    client_id: str | None = None
    message: str
    conversation_history: list[dict[str, Any]] = []
    client_context: dict[str, Any] | None = None
    session_id: str | None = None


class NextStepsResponse(BaseModel):
    client_id: str
    pathway: str
    next_steps: list[NextStep]
    critical_blockers: list[str]


class CreateSessionRequest(BaseModel):
    client_id: str | None = None


class CreateSessionResponse(BaseModel):
    session_id: str


# ── Chat session endpoints ─────────────────────────────────


@router.post("/sessions")
async def create_session(
    body: CreateSessionRequest | None = None,
) -> CreateSessionResponse:
    """Create a new chat session."""
    client_id = body.client_id if body else None
    session = await chat_store.create_session(client_id)
    return CreateSessionResponse(session_id=session.id)


@router.get("/sessions")
async def list_sessions(client_id: str | None = None) -> list[ChatSession]:
    """List chat sessions, optionally filtered by client."""
    return await chat_store.list_sessions(client_id)


@router.get("/sessions/{session_id}")
async def get_session(session_id: str) -> ChatSession:
    """Get a chat session with full message history."""
    session = await chat_store.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str) -> dict[str, str]:
    """Delete a chat session."""
    deleted = await chat_store.delete_session(session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "deleted"}


# ── Chat endpoint ──────────────────────────────────────────


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

    # If session_id is provided, load conversation history from session
    session_messages: list[dict[str, Any]] = []
    if body.session_id:
        session = await chat_store.get_session(body.session_id)
        if session:
            session_messages = session.messages
            # Append user message to session
            session_messages.append({"role": "user", "content": body.message})
            await chat_store.update_session(body.session_id, messages=session_messages)

    conversation_history = (
        session_messages[:-1]
        if session_messages
        else body.conversation_history
    )

    async def event_generator() -> AsyncGenerator[str, None]:
        assistant_text = ""
        async for chunk in run_consultant_turn(
            body.message,
            conversation_history,
            resolved_client_id,
            body.client_context,
        ):
            if await request.is_disconnected():
                break
            # Track assistant text for session persistence
            if body.session_id:
                try:
                    evt = _json.loads(chunk)
                    if evt.get("type") == "text":
                        assistant_text += evt.get("content", "")
                except ValueError:
                    pass
            yield chunk

        # Persist assistant response to session
        if body.session_id and assistant_text:
            session_msgs = list(session_messages)
            session_msgs.append({"role": "assistant", "content": assistant_text})
            # Auto-title from first user message
            title = None
            if len(session_msgs) == 2:
                first_msg = session_msgs[0].get("content", "")
                title = first_msg[:60] + ("..." if len(first_msg) > 60 else "")
            await chat_store.update_session(
                body.session_id, messages=session_msgs, title=title
            )

    return EventSourceResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── Gap analysis endpoints ─────────────────────────────────


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
