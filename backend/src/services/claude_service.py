"""Claude API client with Citations for regulatory Q&A."""

import json
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Any, Literal

import anthropic

from src.config import settings
from src.models.chat import ChatMessage

MICAR_TEXT_PATH = (
    Path(__file__).parent.parent / "data" / "regulatory_docs" / "micar_articles.txt"
)

SYSTEM_PROMPT = """You are DarcyAI, an expert regulatory advisor specialising in \
European crypto-asset regulation, particularly MiCAR (Markets in Crypto-Assets \
Regulation, EU 2023/1114).

Your role:
- Answer questions about crypto-asset licensing requirements in the EU, UK, and \
Switzerland
- Explain MiCAR provisions, CASP authorisation, token classifications, capital \
requirements, and passporting rules
- Provide practical guidance for compliance timelines and checklists
- Always cite specific MiCAR articles when referencing regulatory requirements

Important guidelines:
- Only provide information based on the regulatory documents provided to you
- Clearly distinguish between EU (MiCAR), UK (FCA), and Swiss (FINMA) requirements
- Always note that your responses are informational and do not constitute legal advice
- When uncertain, recommend consulting qualified legal counsel
- Be precise with article references and numerical requirements (capital thresholds, \
timelines, etc.)"""


def _load_micar_text() -> str:
    """Load the MiCAR regulatory text."""
    return MICAR_TEXT_PATH.read_text(encoding="utf-8")


def _build_messages(
    chat_messages: list[ChatMessage],
) -> list[dict[str, str]]:
    """Convert chat messages to Anthropic API format."""
    result: list[dict[str, str]] = []
    for msg in chat_messages:
        if msg.role in ("user", "assistant"):
            result.append({"role": msg.role, "content": msg.content})
    return result


async def stream_chat(
    messages: list[ChatMessage],
) -> AsyncIterator[str]:
    """Stream a chat response from Claude with citations.

    Yields SSE-formatted strings: each line is a JSON object with
    either {"type": "text", "content": "..."} or
    {"type": "citation", "text": "...", "article": "..."} or
    {"type": "done"}.
    """
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    micar_text = _load_micar_text()

    raw_messages = _build_messages(messages)

    # Build properly typed message params
    api_messages: list[anthropic.types.MessageParam] = []

    # First message includes the document
    first_user_content: list[dict[str, Any]] = [
        {
            "type": "document",
            "source": {
                "type": "text",
                "media_type": "text/plain",
                "data": micar_text,
            },
            "title": "MiCAR Regulation (EU) 2023/1114",
            "citations": {"enabled": True},
        },
        {
            "type": "text",
            "text": (
                "The above document contains the MiCAR regulation "
                "text. Use it to answer user questions with "
                "precise citations. Now here is the conversation:"
            ),
        },
    ]

    api_messages.append(
        {"role": "user", "content": first_user_content}  # type: ignore[typeddict-item]
    )

    # Add conversation messages
    for msg in raw_messages:
        role = msg["role"]
        if role in ("user", "assistant"):
            typed_role: Literal["user", "assistant"] = (
                "user" if role == "user" else "assistant"
            )
            api_messages.append({"role": typed_role, "content": msg["content"]})

    # Ensure last message is from user
    if not api_messages or api_messages[-1]["role"] != "user":
        api_messages.append(
            {
                "role": "user",
                "content": "Hello, I need help with crypto licensing.",
            }
        )

    async with client.messages.stream(
        model="claude-opus-4-6",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=api_messages,
    ) as stream:
        async for event in stream:
            if event.type == "content_block_delta":
                delta = event.delta
                if hasattr(delta, "text"):
                    text_val: str = delta.text
                    yield json.dumps({"type": "text", "content": text_val})
                elif hasattr(delta, "citation"):
                    citation: Any = delta.citation
                    cited_text = ""
                    article = ""
                    if hasattr(citation, "cited_text"):
                        cited_text = str(getattr(citation, "cited_text", ""))
                    if hasattr(citation, "document_title"):
                        article = str(getattr(citation, "document_title", ""))
                    yield json.dumps(
                        {
                            "type": "citation",
                            "text": cited_text,
                            "article": article,
                        }
                    )

    yield json.dumps({"type": "done"})
