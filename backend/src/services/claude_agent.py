"""Claude tool-use agent for client onboarding conversations."""

import json
import logging
from collections.abc import AsyncIterator
from datetime import datetime
from typing import Any

import anthropic

from src.config import settings
from src.models.client import Client
from src.services import client_store, rag_service
from src.services.checklist_templates import get_checklist_for_pathway

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are DarcyAI, an intake specialist for JayBee Consulting (jaybeeconsulting.ch), \
a Swiss regulatory consultancy specializing in crypto/blockchain licensing.

Your role is to guide companies through the Swiss crypto licensing intake process. \
You are collecting information to determine whether the client needs:
- SRO membership (e.g., VQF, PolyReg) under AMLA for financial intermediation (1-3 months, lowest cost)
- FINMA FinTech license (deposits up to CHF 100M, 9-16 months, min CHF 300k capital)
- FINMA banking license (full banking activities)
- FINMA DLT Trading Facility license
- FINMA Securities Firm license (FinIA — trading, brokerage, min CHF 1.5M capital, 8-18 months)
- FINMA Payment Systems Operator license (FinfraG — systemically important payment systems, 9-18 months)

**Conversation style:**
- Ask 1-2 questions at a time, in a natural conversational tone
- Explain WHY you're asking when the question might seem unusual
- Use the tools provided to save information as you collect it
- When you have enough information, determine the regulatory pathway

**Key decision logic:**
- If the company handles client assets long-term (custody) OR operates an order book \
→ likely needs FINMA license (not just SRO)
- If the company only does exchange/transfer without custody or order book \
→ SRO membership is likely sufficient
- If accepting deposits from the public → FinTech or banking license needed
- If operating a multilateral payment/settlement system → Payment Systems Operator license
- If dealing in securities (trading, brokerage, market making, underwriting) → Securities Firm license

**Information to collect (in rough order):**
1. Company name and legal structure (AG, GmbH, or other)
2. Business description — what do they do?
3. Specific crypto services (custody, exchange, trading, transfer, advice, etc.)
4. Token types involved (payment, utility, security, stablecoin)
5. Do they handle fiat currency?
6. Do they hold client assets long-term?
7. Do they operate an order book?
8. Swiss presence (office, directors)
9. Existing capital and licenses
10. Current compliance setup (AML officer, auditor, policies)

**After determining the pathway, call set_pathway and then mark_intake_complete.**

Always flag items that need consultant review (unclear answers, potential regulatory \
issues, conflicting information).

Do NOT provide legal advice — you are collecting information for the consulting team."""

TOOLS: list[anthropic.types.ToolParam] = [
    {
        "name": "update_client_field",
        "description": (
            "Update a field on the client's intake"
            " profile. Use this as you collect information."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "field": {
                    "type": "string",
                    "description": (
                        "The field name to update"
                        " (e.g., company_name,"
                        " legal_structure,"
                        " business_description,"
                        " services, handles_fiat,"
                        " handles_client_assets,"
                        " operates_order_book,"
                        " token_types,"
                        " has_swiss_office,"
                        " has_swiss_director,"
                        " existing_capital_chf,"
                        " has_aml_officer,"
                        " has_aml_kyc_policies,"
                        " has_external_auditor,"
                        " has_transaction_monitoring,"
                        " has_sanctions_screening,"
                        " aml_officer_swiss_resident,"
                        " establishment_canton)"
                    ),
                },
                "value": {
                    "description": (
                        "The value to set. Use appropriate"
                        " types: string for text fields,"
                        " boolean for yes/no, integer for"
                        " numbers, array of strings for"
                        " list fields."
                    ),
                },
            },
            "required": ["field", "value"],
        },
    },
    {
        "name": "flag_item",
        "description": (
            "Flag an item for consultant review."
            " Use when you notice potential issues,"
            " unclear information, or regulatory concerns."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "field": {
                    "type": "string",
                    "description": "The field or topic being flagged",
                },
                "reason": {
                    "type": "string",
                    "description": "Why this needs consultant attention",
                },
                "severity": {
                    "type": "string",
                    "enum": ["info", "warning", "critical"],
                    "description": (
                        "How urgent: info=FYI,"
                        " warning=needs review,"
                        " critical=blocking issue"
                    ),
                },
            },
            "required": ["field", "reason", "severity"],
        },
    },
    {
        "name": "search_knowledge_base",
        "description": (
            "Search the regulatory knowledge base for"
            " Swiss crypto licensing info. Use to verify"
            " requirements or answer client questions."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query about Swiss crypto regulation",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "set_pathway",
        "description": (
            "Set the regulatory pathway for this client"
            " after gathering enough information. This"
            " also generates the appropriate checklist."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "pathway": {
                    "type": "string",
                    "enum": [
                        "sro",
                        "finma_fintech",
                        "finma_banking",
                        "finma_dlt",
                        "finma_securities",
                        "finma_payment_systems",
                    ],
                    "description": "The recommended regulatory pathway",
                },
                "target_sro": {
                    "type": "string",
                    "enum": ["VQF", "PolyReg", "SO-FIT", "other"],
                    "description": "If pathway is SRO, which SRO to target",
                },
                "reason": {
                    "type": "string",
                    "description": "Explanation of why this pathway was chosen",
                },
            },
            "required": ["pathway", "reason"],
        },
    },
    {
        "name": "mark_intake_complete",
        "description": (
            "Mark the intake as complete. Call this"
            " after setting the pathway and confirming"
            " all critical info is collected."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string",
                    "description": (
                        "Brief summary of the intake findings for the consultant"
                    ),
                },
            },
            "required": ["summary"],
        },
    },
]


async def _execute_tool(
    client: Client, tool_name: str, tool_input: dict[str, Any]
) -> tuple[Client, str]:
    """Execute a tool call and return updated client + result string."""
    if tool_name == "update_client_field":
        field = tool_input["field"]
        value = tool_input["value"]
        data = client.model_dump()
        if field in data:
            data[field] = value
            data["updated_at"] = datetime.utcnow()
            client = Client.model_validate(data)
            await client_store.save_client(client)
            return client, f"Updated {field} successfully."
        return client, f"Unknown field: {field}"

    if tool_name == "flag_item":
        import uuid

        from src.models.client import FlaggedItem

        flag = FlaggedItem(
            id=str(uuid.uuid4())[:8],
            field=tool_input["field"],
            reason=tool_input["reason"],
            severity=tool_input["severity"],
        )
        client.flags.append(flag)
        client.updated_at = datetime.utcnow()
        await client_store.save_client(client)
        return (
            client,
            f"Flagged {tool_input['field']}"
            f" ({tool_input['severity']}):"
            f" {tool_input['reason']}",
        )

    if tool_name == "search_knowledge_base":
        results = await rag_service.search(tool_input["query"], top_k=3)
        if not results:
            return client, "No relevant results found in the knowledge base."
        texts = []
        for r in results:
            texts.append(f"[{r.get('title', 'Unknown')}]: {r.get('text', '')}")
        return client, "\n\n---\n\n".join(texts)

    if tool_name == "set_pathway":
        pathway = tool_input["pathway"]
        client.pathway = pathway
        if "target_sro" in tool_input:
            client.target_sro = tool_input["target_sro"]
        client.checklist = get_checklist_for_pathway(pathway)
        if pathway.startswith("finma"):
            parts = pathway.split("_", 1)
            if len(parts) > 1:
                client.finma_license_type = parts[1]
        client.status = "in_progress"
        client.updated_at = datetime.utcnow()
        await client_store.save_client(client)
        return (
            client,
            f"Pathway set to {pathway}. Checklist generated"
            f" with {len(client.checklist)} items."
            f" Reason: {tool_input['reason']}",
        )

    if tool_name == "mark_intake_complete":
        client.status = "under_review"
        client.updated_at = datetime.utcnow()
        await client_store.save_client(client)
        return client, f"Intake marked complete. Summary: {tool_input['summary']}"

    return client, f"Unknown tool: {tool_name}"


async def run_onboarding_turn(client: Client, user_message: str) -> AsyncIterator[str]:
    """Run one turn of the onboarding conversation. Yields SSE JSON events."""
    # Save user message to history
    client.conversation_history.append({"role": "user", "content": user_message})
    await client_store.save_client(client)

    # Build messages for Claude
    messages: list[anthropic.types.MessageParam] = []
    for msg in client.conversation_history:
        messages.append({"role": msg["role"], "content": msg["content"]})  # type: ignore[typeddict-item]

    api_client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    # Tool-use loop
    max_iterations = 10
    for _ in range(max_iterations):
        response = await api_client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        # Process response content
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
            # No tools called — conversation turn is done
            if assistant_text:
                client.conversation_history.append(
                    {"role": "assistant", "content": assistant_text}
                )
                await client_store.save_client(client)
            break

        # Execute tools and continue
        # Add assistant message with tool use blocks
        messages.append({"role": "assistant", "content": response.content})

        tool_results: list[dict[str, Any]] = []
        for tool_id, tool_name, tool_input in tool_calls:
            client, result = await _execute_tool(client, tool_name, tool_input)
            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": result,
                }
            )

        messages.append({"role": "user", "content": tool_results})  # type: ignore[typeddict-item]

    yield json.dumps({"type": "done"})
