"""Client onboarding endpoints with SSE streaming."""

import uuid
from collections.abc import AsyncGenerator

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from starlette.requests import Request

from src.models.client import Client
from src.services import client_store
from src.services.claude_agent import run_onboarding_turn

router = APIRouter(prefix="/api/onboard", tags=["onboard"])


class OnboardStartResponse(BaseModel):
    client_id: str


class OnboardChatRequest(BaseModel):
    client_id: str
    message: str


@router.post("/start")
async def start_onboarding() -> OnboardStartResponse:
    """Create a new client and return the client_id."""
    client_id = str(uuid.uuid4())
    client = Client(id=client_id)
    await client_store.save_client(client)
    return OnboardStartResponse(client_id=client_id)


@router.post("/chat")
async def onboard_chat(
    request: Request, body: OnboardChatRequest
) -> EventSourceResponse:
    """Stream an onboarding conversation turn."""
    client = await client_store.get_client(body.client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")

    async def event_generator() -> AsyncGenerator[str, None]:
        async for chunk in run_onboarding_turn(client, body.message):
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
