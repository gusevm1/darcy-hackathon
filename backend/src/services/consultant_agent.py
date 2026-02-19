"""Claude tool-use agent for consultant regulatory co-pilot."""

import json
import logging
from collections.abc import AsyncIterator
from datetime import UTC, datetime
from typing import Any

import anthropic

from src.models.client import Client, FlaggedItem
from src.services import client_store, document_store, rag_service
from src.services.agent_tool_loop import run_tool_loop
from src.services.claude_agent import _sanitize_field_value
from src.services.gap_analyzer import analyze_gaps

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are the FINMA Comply consulting assistant, a regulatory co-pilot for compliance \
professionals.

You assist consultants in analyzing client applications for Swiss financial licensing \
(Banking, FinTech Sandbox, Securities Firm, Fund Management, and Insurance licenses).

**Your capabilities:**
1. Answer regulatory questions with citations from the knowledge base
2. Analyze a client's intake data and identify gaps, risks, and missing items
3. Recommend specific next steps based on the client's current state and pathway
4. Explain documentation requirements for each license type (the KB contains detailed \
per-pathway checklists with 35-88 items per license type)
5. Help draft responses to regulatory authority questions
6. Compare licensing pathways (timelines, capital requirements, document counts)
7. Advise on application timelines and the FINMA EHP submission process
8. List and read uploaded client documents to review their content

**When a client_id is provided:**
- You have access to the client's full profile, checklist, and flags
- You can update client fields, checklist items, and resolve flags
- Always consider the client's specific pathway when answering

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
            " Swiss financial licensing information."
            " Returns relevant document chunks with sources."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query about Swiss financial regulation",
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
                    "description": ("The checklist item ID (e.g., sro-01, fin-01)"),
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
    {
        "name": "list_client_documents",
        "description": "List all uploaded documents for a client with their status and metadata.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID",
                },
            },
            "required": ["client_id"],
        },
    },
    {
        "name": "get_client_document",
        "description": "Retrieve the full text content of an uploaded client document.",
        "input_schema": {
            "type": "object",
            "properties": {
                "client_id": {
                    "type": "string",
                    "description": "The client ID",
                },
                "document_id": {
                    "type": "string",
                    "description": "The document ID (e.g., banking-2-10)",
                },
            },
            "required": ["client_id", "document_id"],
        },
    },
]


async def _execute_tool(tool_name: str, tool_input: dict[str, Any]) -> str:
    """Execute a tool call and return result string."""
    if tool_name == "search_knowledge_base":
        try:
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
        except Exception as exc:
            logger.warning("search_knowledge_base failed: %s", exc)
            return f"Knowledge base search failed: {exc}"

    if tool_name == "get_client":
        try:
            client = await client_store.get_client(tool_input["client_id"])
            if client is None:
                return f"Client {tool_input['client_id']} not found."
            return client.model_dump_json(indent=2)
        except Exception as exc:
            logger.warning("get_client failed: %s", exc)
            return f"Failed to fetch client: {exc}"

    if tool_name == "analyze_gaps":
        try:
            client = await client_store.get_client(tool_input["client_id"])
            if client is None:
                return f"Client {tool_input['client_id']} not found."
            analysis = analyze_gaps(client)
            return analysis.model_dump_json(indent=2)
        except Exception as exc:
            logger.warning("analyze_gaps failed: %s", exc)
            return f"Gap analysis failed: {exc}"

    if tool_name == "update_client_field":
        try:
            client = await client_store.get_client(tool_input["client_id"])
            if client is None:
                return f"Client {tool_input['client_id']} not found."
            data = client.model_dump()
            field = tool_input["field"]
            value = _sanitize_field_value(field, tool_input["value"])
            if field in data:
                data[field] = value
                data["updated_at"] = datetime.now(UTC)
                updated = Client.model_validate(data)
                await client_store.save_client(updated)
                return f"Updated {field} successfully."
            return f"Unknown field: {field}"
        except Exception as exc:
            logger.warning("update_client_field failed: %s", exc)
            return f"Failed to update {tool_input.get('field', '?')}: {exc}"

    if tool_name == "update_checklist_item":
        try:
            client = await client_store.get_client(tool_input["client_id"])
            if client is None:
                return f"Client {tool_input['client_id']} not found."
            status = _sanitize_field_value("checklist_status", tool_input["status"])
            for item in client.checklist:
                if item.id == tool_input["item_id"]:
                    item.status = status
                    if "notes" in tool_input:
                        item.notes = tool_input["notes"]
                    client.updated_at = datetime.now(UTC)
                    await client_store.save_client(client)
                    return (
                        f"Updated checklist item"
                        f" {item.id}: {item.item}"
                        f" → {status}"
                    )
            return f"Checklist item {tool_input['item_id']} not found."
        except Exception as exc:
            logger.warning("update_checklist_item failed: %s", exc)
            return f"Failed to update checklist item: {exc}"

    if tool_name == "flag_item":
        try:
            client = await client_store.get_client(tool_input["client_id"])
            if client is None:
                return f"Client {tool_input['client_id']} not found."
            import uuid

            severity = _sanitize_field_value("severity", tool_input["severity"])
            flag = FlaggedItem(
                id=str(uuid.uuid4())[:8],
                field=tool_input["field"],
                reason=tool_input["reason"],
                severity=severity,
            )
            client.flags.append(flag)
            client.updated_at = datetime.now(UTC)
            await client_store.save_client(client)
            return f"Flag added: {tool_input['field']} ({severity})"
        except Exception as exc:
            logger.warning("flag_item failed: %s", exc)
            return f"Failed to flag item: {exc}"

    if tool_name == "resolve_flag":
        try:
            client = await client_store.get_client(tool_input["client_id"])
            if client is None:
                return f"Client {tool_input['client_id']} not found."
            for flag in client.flags:
                if flag.id == tool_input["flag_id"]:
                    flag.resolved = True
                    flag.resolution_notes = tool_input["resolution_notes"]
                    client.updated_at = datetime.now(UTC)
                    await client_store.save_client(client)
                    return f"Flag {flag.id} resolved: {tool_input['resolution_notes']}"
            return f"Flag {tool_input['flag_id']} not found."
        except Exception as exc:
            logger.warning("resolve_flag failed: %s", exc)
            return f"Failed to resolve flag: {exc}"

    if tool_name == "list_client_documents":
        try:
            docs = await document_store.list_documents(tool_input["client_id"])
            return json.dumps(
                [
                    {
                        "document_id": d.document_id,
                        "file_name": d.file_name,
                        "status": d.status,
                        "file_size": d.file_size,
                    }
                    for d in docs
                ]
            )
        except Exception as exc:
            logger.warning("list_client_documents failed: %s", exc)
            return f"Failed to list documents: {exc}"

    if tool_name == "get_client_document":
        try:
            doc = await document_store.get_document(
                tool_input["client_id"], tool_input["document_id"]
            )
            if doc is None:
                return f"Document {tool_input['document_id']} not found."
            from pathlib import Path

            file_path = Path(doc.file_path)
            if not file_path.exists():
                return "Document file not found on disk."
            text = file_path.read_text(encoding="utf-8")
            if len(text) > 10000:
                text = text[:10000] + "\n\n[... truncated — document continues ...]"
            return text
        except Exception as exc:
            logger.warning("get_client_document failed: %s", exc)
            return f"Failed to read document: {exc}"

    return f"Unknown tool: {tool_name}"


async def run_consultant_turn(
    user_message: str,
    conversation_history: list[dict[str, Any]],
    client_id: str | None = None,
    client_context: dict[str, Any] | None = None,
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
            svc = ", ".join(client.services) if client.services else "Not specified"
            system += f"- Services: {svc}\n"
            done = sum(1 for i in client.checklist if i.status == "complete")
            total = len(client.checklist)
            system += f"- Checklist: {done}/{total} complete\n"
            unresolved = sum(1 for f in client.flags if not f.resolved)
            system += f"- Flags: {unresolved} unresolved\n"
    elif client_context:
        # Frontend-provided client context (demo/mock data not in backend DB)
        system += "\n\n**Current client context (from application):**\n"
        system += f"- Name: {client_context.get('name', 'Unknown')}\n"
        system += f"- Company: {client_context.get('company', 'Unknown')}\n"
        system += f"- License Type: {client_context.get('licenseType', 'Unknown')}\n"
        stage_name = client_context.get("currentStageName", "Unknown")
        system += f"- Current Stage: {stage_name}\n"
        doc_summary = client_context.get("documentSummary", "")
        if doc_summary:
            system += f"- Documents: {doc_summary}\n"

    messages: list[anthropic.types.MessageParam] = list(conversation_history)  # type: ignore[arg-type]
    messages.append({"role": "user", "content": user_message})

    async for event_json in run_tool_loop(
        messages=messages,
        system=system,
        tools=TOOLS,
        execute_tool=_execute_tool,
        max_tokens=4096,
    ):
        yield event_json
