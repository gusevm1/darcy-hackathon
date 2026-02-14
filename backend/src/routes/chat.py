"""Chat endpoint with SSE streaming."""

from collections.abc import AsyncGenerator

from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from starlette.requests import Request

from src.models.chat import ChatRequest
from src.services.claude_service import stream_chat

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
async def chat(request: Request, body: ChatRequest) -> EventSourceResponse:
    """Stream a regulatory Q&A response with citations."""

    async def event_generator() -> AsyncGenerator[str, None]:
        async for chunk in stream_chat(body.messages):
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
