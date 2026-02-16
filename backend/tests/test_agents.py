"""Integration tests for the onboarding and consultant agents.

These tests call the real Anthropic API using Haiku to keep costs low.
They are skipped when ANTHROPIC_API_KEY is set to the dummy "test-key".

Run explicitly with a real key:
    ANTHROPIC_API_KEY=sk-... pytest tests/test_agents.py -v
"""

import json
import os
from collections.abc import AsyncIterator
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from src.config import settings
from src.models.client import Client
from src.services import client_store

_has_real_key = (
    os.environ.get("ANTHROPIC_API_KEY", "test-key") != "test-key"
)
requires_api_key = pytest.mark.skipif(
    not _has_real_key, reason="No real ANTHROPIC_API_KEY"
)

HAIKU_MODEL = "claude-haiku-4-5-20251001"


@pytest.fixture(autouse=True)
def _use_haiku(monkeypatch: pytest.MonkeyPatch) -> None:
    """Override agent_model to use Haiku for all agent tests."""
    monkeypatch.setattr(settings, "agent_model", HAIKU_MODEL)


# --------------- helpers ---------------


async def _collect_events(
    ait: AsyncIterator[str],
) -> list[dict[str, Any]]:
    """Drain an async iterator of JSON strings into parsed dicts."""
    events: list[dict[str, Any]] = []
    async for raw in ait:
        events.append(json.loads(raw))
    return events


async def _create_test_client() -> Client:
    c = Client(id="agent-test-client", company_name="Test Corp AG")
    await client_store.save_client(c)
    return c


def _mock_rag_search() -> AsyncMock:
    """Return a mock for rag_service.search that returns a fake result."""
    return AsyncMock(
        return_value=[
            {
                "text": "Banking license requires CHF 10M.",
                "title": "BankA",
                "source": "finma.ch",
                "doc_id": "test-doc",
                "score": 0.5,
            }
        ]
    )


# --------------- onboarding agent ---------------


@requires_api_key
@pytest.mark.asyncio
async def test_onboarding_agent_basic_turn() -> None:
    """Send a simple message and verify SSE events."""
    from src.services.claude_agent import run_onboarding_turn

    with patch(
        "src.services.rag_service.search", new_callable=_mock_rag_search
    ):
        client = await _create_test_client()
        events = await _collect_events(
            run_onboarding_turn(
                client,
                "We want to set up a payment company in Zurich",
            )
        )

    types = [e["type"] for e in events]
    assert "text" in types, f"Expected text event, got: {types}"
    assert types[-1] == "done", "Last event should be 'done'"

    text_content = "".join(
        str(e.get("content", ""))
        for e in events
        if e["type"] == "text"
    )
    assert len(text_content) > 10


@requires_api_key
@pytest.mark.asyncio
async def test_onboarding_agent_uses_tools() -> None:
    """Agent should call update_client_field when given client info."""
    from src.services.claude_agent import run_onboarding_turn

    with patch(
        "src.services.rag_service.search", new_callable=_mock_rag_search
    ):
        client = await _create_test_client()
        events = await _collect_events(
            run_onboarding_turn(
                client,
                "Our company is called Alpine Fintech GmbH,"
                " we are a GmbH based in Zurich",
            )
        )

    types = [e["type"] for e in events]
    assert "tool_use" in types, f"Expected tool_use, got: {types}"

    tool_names = [
        e.get("tool") for e in events if e["type"] == "tool_use"
    ]
    assert "update_client_field" in tool_names, (
        f"Expected update_client_field, got: {tool_names}"
    )


# --------------- consultant agent ---------------


@requires_api_key
@pytest.mark.asyncio
async def test_consultant_agent_basic_turn() -> None:
    """Send a regulatory question to the consultant agent."""
    from src.services.consultant_agent import run_consultant_turn

    with patch(
        "src.services.rag_service.search", new_callable=_mock_rag_search
    ):
        events = await _collect_events(
            run_consultant_turn(
                user_message=(
                    "What capital is required for a banking license?"
                    " Answer briefly in one sentence."
                ),
                conversation_history=[],
            )
        )

    types = [e["type"] for e in events]
    assert "text" in types
    assert types[-1] == "done"

    text_content = "".join(
        str(e.get("content", ""))
        for e in events
        if e["type"] == "text"
    )
    assert len(text_content) > 10


@requires_api_key
@pytest.mark.asyncio
async def test_consultant_agent_with_client_context() -> None:
    """Consultant agent should handle a real client_id."""
    from src.services.consultant_agent import run_consultant_turn

    with patch(
        "src.services.rag_service.search", new_callable=_mock_rag_search
    ):
        client = await _create_test_client()
        events = await _collect_events(
            run_consultant_turn(
                user_message=(
                    "What are the next steps for this client?"
                    " Answer briefly."
                ),
                conversation_history=[],
                client_id=client.id,
            )
        )

    types = [e["type"] for e in events]
    assert "text" in types
    assert types[-1] == "done"
