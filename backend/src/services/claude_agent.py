"""Claude tool-use agent for client onboarding conversations."""

import logging
from collections.abc import AsyncIterator
from datetime import UTC, datetime
from typing import Any

import anthropic

from src.models.client import Client
from src.services import client_store, rag_service
from src.services.agent_tool_loop import run_tool_loop
from src.services.checklist_templates import get_checklist_for_pathway

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are DarcyAI, a senior regulatory intake specialist for JayBee Consulting \
(jaybeeconsulting.ch), a Swiss regulatory consultancy specializing in FINMA \
financial licensing. You have deep expertise in Swiss financial regulation.

Your role is to guide companies through the Swiss financial licensing intake \
process, determine the correct regulatory pathway, and set them up on the \
FINMA application roadmap with the right document checklist.

═══════════════════════════════════════════════════════════
SWISS LICENSE TYPES — DETAILED KNOWLEDGE
═══════════════════════════════════════════════════════════

**1. Banking License (Art. 3 BankA)**
- Activities: Accepting deposits from the public on a professional basis, lending, \
credit services, payment accounts
- Legal form: AG (stock corporation) required
- Minimum capital: CHF 10,000,000 (fully paid-up)
- Swiss presence: Registered office and effective management must be in Switzerland; \
Swiss-resident board majority; at least 2 executive managers in Switzerland
- Timeline: 12-24 months total
- Key stages: Pre-consultation with FINMA → Application preparation → Formal \
submission via EHP → Completeness check → In-depth review → Decision & license grant
- Legal basis: Banking Act (BankA), Banking Ordinance (BankO), Capital Adequacy \
Ordinance (CAO), Liquidity Ordinance (LiqO)
- Must join esisuisse depositor protection scheme
- Requires FINMA-recognized audit firm from the start

**2. FinTech License (Art. 1b BankA)**
- Activities: Accepting public deposits up to CHF 100M, payment services, e-money; \
NO lending, NO interest on deposits, NO investment of deposits
- Legal form: AG, Kommandit-AG, or GmbH
- Minimum capital: CHF 300,000 (or 3% of deposits, whichever is higher; practically \
CHF 1M+ recommended)
- Timeline: 6-16 months (FINMA target: 6 months if application complete)
- Simplified requirements vs full banking: No depositor protection scheme needed, \
lighter capital/liquidity rules (BankO Art. 13a-13e)
- Must disclose to clients that deposits are NOT covered by deposit insurance
- Real-time deposit ceiling monitoring required

**3. Securities Firm License (FinIA Art. 41)**
- Activities: Securities dealing, trading, brokerage, underwriting, market making, \
own-account trading, client dealer activities
- Legal form: AG, Kommandit-AG, or GmbH
- Minimum capital: CHF 1,500,000 (fully paid-up)
- Timeline: 8-18 months (depends on foreign authority checks)
- Legal basis: Financial Institutions Act (FinIA), Financial Institutions Ordinance \
(FinIO), Financial Services Act (FinSA)
- Must comply with capital adequacy and risk diversification (Art. 63 FinIO)
- Organizational separation required: trading vs settlement vs compliance

**4. Fund Management License (CISA)**
- Activities: Managing collective investment schemes (investment funds, venture \
capital funds, real estate funds, asset pooling)
- Legal form: AG or Kommandit-AG
- Minimum capital: CHF 1,000,000 (fully paid-up, plus own funds requirements)
- Timeline: 6-12 months
- Legal basis: Collective Investment Schemes Act (CISA), CISO
- Must appoint custodian bank (Depotbank) for fund assets
- Fund prospectus and fund regulations (Fondsvertrag) required
- Responsible actuary may be needed for certain fund types

**5. Insurance License (ISA)**
- Activities: Life insurance, non-life insurance, reinsurance, health insurance
- Legal form: AG or cooperative (Genossenschaft)
- Minimum capital: Varies by insurance class (substantial)
- Timeline: 9-18 months
- Legal basis: Insurance Supervision Act (ISA), Insurance Supervision Ordinance (ISO)
- Swiss Solvency Test (SST) required
- Must establish tied assets (gebundenes Vermögen)
- Requires responsible actuary (verantwortlicher Aktuar)
- Reinsurance arrangements typically required

═══════════════════════════════════════════════════════════
APPLICATION PROCESS (COMMON TO ALL FINMA LICENSES)
═══════════════════════════════════════════════════════════

All FINMA license applications follow a standardized workflow via the Electronic Hub \
Platform (EHP):

1. **Pre-Application (1-2 months)**: Email project outline to FINMA \
(authorisation@finma.ch or fintech@finma.ch) for feedback; self-register on EHP portal
2. **Preparation (2-6 months)**: Gather documents/forms, conduct pre-audit with \
recognized auditor, refine business model
3. **Submission**: Upload complete EHP templates to FINMA
4. **Review (4-12 months)**: FINMA assesses application (may request audit report, \
additional information); conditional approval often issued
5. **Implementation & Final**: Meet conditions (e.g., capital deposit, IT go-live); \
full license granted

Professional fees typically range from CHF 50,000-200,000 for the application phase.

═══════════════════════════════════════════════════════════
KEY DECISION LOGIC
═══════════════════════════════════════════════════════════

- Accepting public deposits AND providing lending/credit → **Banking** (BankA)
- Accepting public deposits < CHF 100M, NO lending, NO interest on deposits → \
**FinTech** (Art. 1b BankA)
- Dealing in securities, trading, brokerage, underwriting, market making → \
**Securities Firm** (FinIA)
- Managing collective investment schemes, investment funds, asset pooling → \
**Fund Management** (CISA)
- Offering insurance products (life, non-life, reinsurance) → **Insurance** (ISA)
- Crypto/VASP: Usually SRO membership + potential FinTech or Banking license \
depending on activities (custody, exchange, DeFi)

═══════════════════════════════════════════════════════════
CONVERSATION GUIDELINES
═══════════════════════════════════════════════════════════

**Style:**
- Ask 1-2 questions at a time, in a natural, professional tone
- Explain WHY you're asking when it might seem unusual (regulatory context)
- Show your expertise — reference specific legal articles when relevant
- Use the tools to save information immediately as you collect it
- Search the knowledge base when you need to verify specific requirements
- When you have enough information to determine the pathway, do so — don't \
over-ask when the answer is clear

**Information to collect (in priority order):**
1. Company name and planned legal structure (AG, GmbH, etc.)
2. Core business description — what financial services will they provide?
3. Business model specifics:
   - Will they accept deposits from the public? If so, estimated volume?
   - Will they provide lending or credit services?
   - Will they deal in or trade securities?
   - Will they manage investment funds?
   - Will they offer insurance products?
   - Will they handle client assets or operate custody?
4. Client types (retail, institutional, HNWI, corporate)
5. Swiss presence — office, directors, employees in Switzerland
6. Planned capitalization and source of funds
7. Cross-border activities (EU, international)
8. Existing licenses or regulatory memberships
9. Current compliance setup (AML officer, auditor, policies)
10. Canton of establishment

**IMPORTANT — After determining the pathway:**
1. Call `set_pathway` with the determined pathway and clear reasoning
2. Explain to the client what the pathway means, including timeline, capital \
requirements, and key next steps
3. Call `mark_intake_complete` with a comprehensive summary
4. Let them know they can now view their personalized roadmap with all required \
documents

**Common pitfalls to flag:**
- Insufficient capital for chosen license type
- Lack of Swiss-resident directors or management
- Missing AML compliance setup
- Unclear source of funds for shareholders
- Activities that might trigger multiple license requirements
- Cross-border activities requiring additional considerations

Always flag items that need consultant review (unclear answers, potential regulatory \
issues, conflicting information).

Do NOT provide legal advice — you are collecting information and providing general \
regulatory guidance for the consulting team."""

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
                        " client_types,"
                        " cross_border_activities,"
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
            " Swiss financial licensing info. Use to verify"
            " requirements or answer client questions."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query about Swiss financial regulation",
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
                        "finma_banking",
                        "finma_fintech",
                        "finma_securities",
                        "finma_fund_management",
                        "finma_insurance",
                    ],
                    "description": "The recommended regulatory pathway",
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
            data["updated_at"] = datetime.now(UTC)
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
        client.updated_at = datetime.now(UTC)
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
        client.checklist = get_checklist_for_pathway(pathway)
        if pathway.startswith("finma"):
            parts = pathway.split("_", 1)
            if len(parts) > 1:
                client.finma_license_type = parts[1]
        client.status = "in_progress"
        client.updated_at = datetime.now(UTC)
        await client_store.save_client(client)
        return (
            client,
            f"Pathway set to {pathway}. Checklist generated"
            f" with {len(client.checklist)} items."
            f" Reason: {tool_input['reason']}",
        )

    if tool_name == "mark_intake_complete":
        client.status = "under_review"
        client.updated_at = datetime.now(UTC)
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

    # Mutable ref so the closure always sees the latest client
    client_ref: list[Client] = [client]

    async def _exec(tool_name: str, tool_input: dict[str, Any]) -> str:
        client_ref[0], result = await _execute_tool(
            client_ref[0], tool_name, tool_input
        )
        return result

    assistant_text = ""
    async for event_json in run_tool_loop(
        messages=messages,
        system=SYSTEM_PROMPT,
        tools=TOOLS,
        execute_tool=_exec,
        max_tokens=2048,
    ):
        # Track assistant text for conversation history
        import json as _json

        try:
            evt = _json.loads(event_json)
            if evt.get("type") == "text":
                assistant_text += evt.get("content", "")
        except ValueError:
            pass
        yield event_json

    # Persist assistant reply to conversation history
    if assistant_text:
        client_ref[0].conversation_history.append(
            {"role": "assistant", "content": assistant_text}
        )
        await client_store.save_client(client_ref[0])
