"""Shared tool-use loop for Claude agents (onboarding & consultant)."""

import json
from collections.abc import AsyncIterator, Awaitable, Callable
from typing import Any

import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import settings


async def run_tool_loop(
    *,
    messages: list[anthropic.types.MessageParam],
    system: str,
    tools: list[anthropic.types.ToolParam],
    execute_tool: Callable[[str, dict[str, Any]], Awaitable[str]],
    model: str | None = None,
    max_tokens: int = 2048,
    max_iterations: int = 10,
) -> AsyncIterator[str]:
    """Run the Claude tool-use loop, yielding SSE JSON events.

    Args:
        messages: Conversation messages for Claude.
        system: System prompt.
        tools: Tool definitions.
        execute_tool: Async callback that takes (tool_name, tool_input) and
            returns a result string. The caller is responsible for any side
            effects (e.g. persisting client state).
        model: Claude model ID. Defaults to ``settings.agent_model``.
        max_tokens: Max tokens per Claude response.
        max_iterations: Max tool-use round trips.

    Yields:
        JSON-encoded SSE event strings (text, tool_use, done).
    """
    resolved_model = model or settings.agent_model

    api_client = anthropic.AsyncAnthropic(
        api_key=settings.anthropic_api_key, timeout=120.0
    )

    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=2, max=8),
        reraise=True,
    )
    async def _call_claude(
        msgs: list[anthropic.types.MessageParam],
    ) -> anthropic.types.Message:
        return await api_client.messages.create(
            model=resolved_model,
            max_tokens=max_tokens,
            system=system,
            tools=tools,
            messages=msgs,
        )

    for _ in range(max_iterations):
        response = await _call_claude(messages)

        assistant_text = ""
        tool_calls: list[tuple[str, str, dict[str, Any]]] = []

        for block in response.content:
            if block.type == "text":
                assistant_text += block.text
                yield json.dumps({"type": "text", "content": block.text})
            elif block.type == "tool_use":
                tool_calls.append((block.id, block.name, block.input))
                yield json.dumps(
                    {
                        "type": "tool_use",
                        "tool": block.name,
                        "input": block.input,
                    }
                )

        if not tool_calls:
            break

        # Serialize content blocks to plain dicts so they survive
        # a round-trip through the SDK without pydantic compat issues.
        content_dicts: list[dict[str, Any]] = []
        for block in response.content:
            if block.type == "text":
                content_dicts.append(
                    {"type": "text", "text": block.text}
                )
            elif block.type == "tool_use":
                content_dicts.append(
                    {
                        "type": "tool_use",
                        "id": block.id,
                        "name": block.name,
                        "input": block.input,
                    }
                )
        messages.append({"role": "assistant", "content": content_dicts})  # type: ignore[typeddict-item]

        tool_results: list[dict[str, Any]] = []
        for tool_id, tool_name, tool_input in tool_calls:
            result = await execute_tool(tool_name, tool_input)
            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": result,
                }
            )

        messages.append({"role": "user", "content": tool_results})  # type: ignore[typeddict-item]

    yield json.dumps({"type": "done"})
