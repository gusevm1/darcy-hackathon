"""Claude tool-use agent for consultant regulatory co-pilot."""

import json
import logging
from collections.abc import AsyncIterator
from datetime import datetime
from typing import Any

import anthropic

from src.config import settings
from src.models.client import Client, FlaggedItem
from src.services import client_store, rag_service
from src.services.gap_analyzer import analyze_gaps

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are DarcyAI, a regulatory co-pilot for JayBee Consulting's compliance team \
(jaybeeconsulting.ch).

You assist consultants in analyzing client applications for Swiss crypto licensing \
(SRO membership and FINMA licensing).

**Your capabilities:**
1. Answer regulatory questions with citations from the knowledge base
2. Analyze a client's intake data and identify gaps, risks, and missing items
3. Recommend specific next steps based on the client's current state
4. Explain regulatory requirements in context of the client's specific situation
5. Help draft responses to regulatory authority questions

**When a client_id is provided:**
- You have access to the client's full profile, checklist, and flags
- You can update client fields, checklist items, and resolve flags
- Always consider the client's specific pathway (SRO vs FINMA) when answering

**When no client_id is provided:**
- You operate in pure regulatory Q&A mode
- Search the knowledge base to answer questions
- Cannot modify any client data

**Guidelines:**
- Always cite specific legal references (AMLA articles, FINMA guidance, SRO rules)
- Be precise and actionable — consultants need specific guidance, not generalities
- When analyzing gaps, prioritize by impact and urgency
- Flag any compliance risks or regulatory concerns proactively
- Note that your responses are for internal consultant use \
and do not constitute legal advice"""

TOOLS: list[anthropic.types.ToolParam] = [
    {
        "name": "search_knowledge_base",
        "description": (
            "Search the regulatory knowledge base for"
            " Swiss crypto licensing information."
            " Returns relevant document chunks with sources."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query about Swiss crypto regulation",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "get_client",
        "description": "Fetch the full client profile including checklist and flags.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID to fetch",
                },
            },
            "required": ["client_id"],
        },
    },
    {
        "name": "analyze_gaps",
        "description": (
            "Run a comprehensive gap analysis on a"
            " client. Returns readiness score, gaps"
            " by category, next steps, and blockers."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID to analyze",
                },
            },
            "required": ["client_id"],
        },
    },
    {
        "name": "update_client_field",
        "description": "Update a field on the client's profile.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID",
                },
                "field": {
                    "type": "string",
                    "description": "The field name to update",
                },
                "value": {
                    "description": "The new value",
                },
            },
            "required": ["client_id", "field", "value"],
        },
    },
    {
        "name": "update_checklist_item",
        "description": "Update the status of a checklist item.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID",
                },
                "item_id": {
                    "type": "string",
                    "description": (
                        "The checklist item ID"
                        " (e.g., sro-01, fin-01)"
                    ),
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "not_started",
                        "in_progress",
                        "complete",
                        "blocked",
                        "not_applicable",
                    ],
                    "description": "The new status",
                },
                "notes": {
                    "type": "string",
                    "description": "Optional notes about the status change",
                },
            },
            "required": ["client_id", "item_id", "status"],
        },
    },
    {
        "name": "flag_item",
        "description": "Add a new flag to a client for consultant review.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID",
                },
                "field": {
                    "type": "string",
                    "description": "The field or topic being flagged",
                },
                "reason": {
                    "type": "string",
                    "description": "Why this needs attention",
                },
                "severity": {
                    "type": "string",
                    "enum": ["info", "warning", "critical"],
                },
            },
            "required": ["client_id", "field", "reason", "severity"],
        },
    },
    {
        "name": "resolve_flag",
        "description": "Resolve an existing flag on a client.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID",
                },
                "flag_id": {
                    "type": "string",
                    "description": "The flag ID to resolve",
                },
                "resolution_notes": {
                    "type": "string",
                    "description": "How the issue was resolved",
                },
            },
            "required": ["client_id", "flag_id", "resolution_notes"],
        },
    },
]


async def _execute_tool(tool_name: str, tool_input: dict[str, Any]) -> str:
    """Execute a tool call and return result string."""
    if tool_name == "search_knowledge_base":
        results = await rag_service.search(tool_input["query"], top_k=5)
        if not results:
            return "No relevant results found in the knowledge base."
        texts = []
        for r in results:
            texts.append(
                f"[Source: {r.get('title', 'Unknown')}"
                f" — {r.get('source', '')}]"
                f"\n{r.get('text', '')}"
            )
        return "\n\n---\n\n".join(texts)

    if tool_name == "get_client":
        client = await client_store.get_client(tool_input["client_id"])
        if client is None:
            return f"Client {tool_input['client_id']} not found."
        return client.model_dump_json(indent=2)

    if tool_name == "analyze_gaps":
        client = await client_store.get_client(tool_input["client_id"])
        if client is None:
            return f"Client {tool_input['client_id']} not found."
        analysis = analyze_gaps(client)
        return analysis.model_dump_json(indent=2)

    if tool_name == "update_client_field":
        client = await client_store.get_client(tool_input["client_id"])
        if client is None:
            return f"Client {tool_input['client_id']} not found."
        data = client.model_dump()
        field = tool_input["field"]
        if field in data:
            data[field] = tool_input["value"]
            data["updated_at"] = datetime.utcnow()
            updated = Client.model_validate(data)
            await client_store.save_client(updated)
            return f"Updated {field} successfully."
        return f"Unknown field: {field}"

    if tool_name == "update_checklist_item":
        client = await client_store.get_client(tool_input["client_id"])
        if client is None:
            return f"Client {tool_input['client_id']} not found."
        for item in client.checklist:
            if item.id == tool_input["item_id"]:
                item.status = tool_input["status"]
                if "notes" in tool_input:
                    item.notes = tool_input["notes"]
                client.updated_at = datetime.utcnow()
                await client_store.save_client(client)
                return (
                    f"Updated checklist item"
                    f" {item.id}: {item.item}"
                    f" → {tool_input['status']}"
                )
        return f"Checklist item {tool_input['item_id']} not found."

    if tool_name == "flag_item":
        client = await client_store.get_client(tool_input["client_id"])
        if client is None:
            return f"Client {tool_input['client_id']} not found."
        import uuid

        flag = FlaggedItem(
            id=str(uuid.uuid4())[:8],
            field=tool_input["field"],
            reason=tool_input["reason"],
            severity=tool_input["severity"],
        )
        client.flags.append(flag)
        client.updated_at = datetime.utcnow()
        await client_store.save_client(client)
        return f"Flag added: {tool_input['field']} ({tool_input['severity']})"

    if tool_name == "resolve_flag":
        client = await client_store.get_client(tool_input["client_id"])
        if client is None:
            return f"Client {tool_input['client_id']} not found."
        for flag in client.flags:
            if flag.id == tool_input["flag_id"]:
                flag.resolved = True
                flag.resolution_notes = tool_input["resolution_notes"]
                client.updated_at = datetime.utcnow()
                await client_store.save_client(client)
                return f"Flag {flag.id} resolved: {tool_input['resolution_notes']}"
        return f"Flag {tool_input['flag_id']} not found."

    return f"Unknown tool: {tool_name}"


async def run_consultant_turn(
    user_message: str,
    conversation_history: list[dict[str, Any]],
    client_id: str | None = None,
) -> AsyncIterator[str]:
    """Run one turn of the consultant conversation. Yields SSE JSON events."""
    # Build system prompt with optional client context
    system = SYSTEM_PROMPT
    if client_id:
        client = await client_store.get_client(client_id)
        if client:
            system += f"\n\n**Current client context (ID: {client_id}):**\n"
            system += f"- Company: {client.company_name or 'Not set'}\n"
            system += f"- Status: {client.status}\n"
            system += f"- Pathway: {client.pathway or 'Undetermined'}\n"
            svc = (
                ", ".join(client.services)
                if client.services
                else "Not specified"
            )
            system += f"- Services: {svc}\n"
            done = sum(
                1
                for i in client.checklist
                if i.status == "complete"
            )
            total = len(client.checklist)
            system += (
                f"- Checklist: {done}/{total} complete\n"
            )
            unresolved = sum(
                1 for f in client.flags if not f.resolved
            )
            system += (
                f"- Flags: {unresolved} unresolved\n"
            )

    messages: list[dict[str, Any]] = list(conversation_history)
    messages.append({"role": "user", "content": user_message})

    api_client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    # Tool-use loop
    max_iterations = 10
    for _ in range(max_iterations):
        response = await api_client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            system=system,
            tools=TOOLS,
            messages=messages,  # type: ignore[arg-type]
        )

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

        # Execute tools
        messages.append({"role": "assistant", "content": response.content})

        tool_results: list[dict[str, Any]] = []
        for tool_id, tool_name, tool_input in tool_calls:
            result = await _execute_tool(tool_name, tool_input)
            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": result,
                }
            )

        messages.append({"role": "user", "content": tool_results})

    yield json.dumps({"type": "done"})
