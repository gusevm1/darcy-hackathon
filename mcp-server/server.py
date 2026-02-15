"""Darcy MCP Server — exposes Swiss financial licensing compliance tools.

Wraps the Darcy FastAPI backend as an MCP stdio server so any MCP client
(Claude Code, Claude Desktop, etc.) can manage clients, search the regulatory
knowledge base, run gap analyses, and consult the AI compliance assistant.
"""

from __future__ import annotations

import json
import os
from typing import Any

import httpx
from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
DARCY_API_BASE = os.environ.get("DARCY_API_URL", "http://localhost:8000")

mcp = FastMCP(
    "darcy",
    instructions="Swiss financial licensing compliance platform — manage clients, search regulations, analyse gaps, and consult the AI assistant.",
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _url(path: str) -> str:
    return f"{DARCY_API_BASE}{path}"


def _fmt(data: Any) -> str:
    """Pretty-print JSON-serialisable data."""
    if isinstance(data, str):
        return data
    return json.dumps(data, indent=2, default=str)


async def _get(path: str, params: dict | None = None) -> Any:
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(_url(path), params=params)
        r.raise_for_status()
        return r.json()


async def _post(path: str, json_body: dict | None = None) -> Any:
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(_url(path), json=json_body)
        r.raise_for_status()
        return r.json()


async def _patch(path: str, json_body: dict | None = None) -> Any:
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.patch(_url(path), json=json_body)
        r.raise_for_status()
        return r.json()


async def _delete(path: str) -> Any:
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.delete(_url(path))
        r.raise_for_status()
        return r.json()


# ---------------------------------------------------------------------------
# Client Management Tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def list_clients(skip: int = 0, limit: int = 50) -> str:
    """List all clients in the Darcy platform.

    Returns a paginated list with id, company name, status, pathway, and timestamps.
    """
    data = await _get("/api/clients", params={"skip": skip, "limit": limit})
    return _fmt(data)


@mcp.tool()
async def get_client(client_id: str) -> str:
    """Get full details for a specific client.

    Returns everything: company info, regulatory pathway, compliance readiness,
    checklist items, flags, and conversation history.

    Args:
        client_id: The UUID of the client to retrieve.
    """
    data = await _get(f"/api/clients/{client_id}")
    return _fmt(data)


@mcp.tool()
async def create_client(
    company_name: str = "",
    business_description: str | None = None,
    legal_structure: str | None = None,
    establishment_canton: str | None = None,
    has_swiss_office: bool | None = None,
    has_swiss_director: bool | None = None,
    services: list[str] | None = None,
    handles_fiat: bool | None = None,
    handles_client_assets: bool | None = None,
    client_types: list[str] | None = None,
    cross_border_activities: bool | None = None,
) -> str:
    """Create a new client for Swiss financial licensing.

    Provide as much initial data as available. Missing fields can be filled later.

    Args:
        company_name: Company name (e.g. "Alpine Digital Bank AG").
        business_description: What the company does.
        legal_structure: "AG", "GmbH", or "other".
        establishment_canton: Swiss canton (e.g. "Zurich", "Zug").
        has_swiss_office: Whether they have a Swiss office.
        has_swiss_director: Whether they have a Swiss-resident director.
        services: List of services/activities offered.
        handles_fiat: Whether the company handles fiat currency.
        handles_client_assets: Whether they handle client assets.
        client_types: Types of clients served (e.g. ["retail", "institutional"]).
        cross_border_activities: Whether they operate cross-border.
    """
    body: dict[str, Any] = {}
    if company_name:
        body["company_name"] = company_name
    if business_description is not None:
        body["business_description"] = business_description
    if legal_structure is not None:
        body["legal_structure"] = legal_structure
    if establishment_canton is not None:
        body["establishment_canton"] = establishment_canton
    if has_swiss_office is not None:
        body["has_swiss_office"] = has_swiss_office
    if has_swiss_director is not None:
        body["has_swiss_director"] = has_swiss_director
    if services is not None:
        body["services"] = services
    if handles_fiat is not None:
        body["handles_fiat"] = handles_fiat
    if handles_client_assets is not None:
        body["handles_client_assets"] = handles_client_assets
    if client_types is not None:
        body["client_types"] = client_types
    if cross_border_activities is not None:
        body["cross_border_activities"] = cross_border_activities

    data = await _post("/api/clients", json_body=body)
    return _fmt(data)


@mcp.tool()
async def update_client(client_id: str, updates: dict[str, Any]) -> str:
    """Update fields on an existing client.

    Args:
        client_id: The UUID of the client.
        updates: Dict of fields to update. Valid fields include:
            company_name, business_description, legal_structure,
            establishment_canton, has_swiss_office, has_swiss_director,
            services, handles_fiat, handles_client_assets, client_types,
            cross_border_activities, existing_capital_chf, has_aml_officer,
            aml_officer_swiss_resident, has_external_auditor,
            has_aml_kyc_policies, has_transaction_monitoring,
            has_sanctions_screening.
    """
    data = await _patch(f"/api/clients/{client_id}", json_body=updates)
    return _fmt(data)


@mcp.tool()
async def update_checklist_item(
    client_id: str,
    item_id: str,
    status: str,
    notes: str | None = None,
) -> str:
    """Update a checklist item's status for a client.

    Args:
        client_id: The UUID of the client.
        item_id: The checklist item ID.
        status: New status — one of: not_started, in_progress, complete, blocked, not_applicable.
        notes: Optional notes about this status change.
    """
    body: dict[str, Any] = {"status": status}
    if notes is not None:
        body["notes"] = notes
    data = await _patch(f"/api/clients/{client_id}/checklist/{item_id}", json_body=body)
    return _fmt(data)


# ---------------------------------------------------------------------------
# Knowledge Base Tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def search_knowledge_base(query: str, top_k: int = 5) -> str:
    """Search the Swiss regulatory knowledge base using hybrid semantic + lexical search.

    Searches across curated Swiss financial law documents (AMLA, FINMA licensing,
    SRO membership, MiCAR, etc.) using vector similarity + BM25 keyword matching
    fused with Reciprocal Rank Fusion.

    Args:
        query: The search query (e.g. "AML officer requirements for fintech license").
        top_k: Number of results to return (default 5).
    """
    data = await _post("/api/kb/search", json_body={"query": query, "top_k": top_k})
    return _fmt(data)


@mcp.tool()
async def list_knowledge_base_documents(skip: int = 0, limit: int = 50) -> str:
    """List all documents indexed in the regulatory knowledge base.

    Returns doc_id, title, and source for each document.
    """
    data = await _get("/api/kb/documents", params={"skip": skip, "limit": limit})
    return _fmt(data)


@mcp.tool()
async def delete_knowledge_base_document(doc_id: str) -> str:
    """Remove a document from the knowledge base.

    Args:
        doc_id: The document ID to delete.
    """
    data = await _delete(f"/api/kb/documents/{doc_id}")
    return _fmt(data)


# ---------------------------------------------------------------------------
# Gap Analysis & Next Steps
# ---------------------------------------------------------------------------

@mcp.tool()
async def analyze_gaps(client_id: str) -> str:
    """Run a compliance gap analysis for a client.

    Evaluates the client's current state against Swiss regulatory requirements
    and returns: readiness score (0-1), identified gaps by category, critical
    blockers, and prioritised next steps with estimated timelines.

    Args:
        client_id: The UUID of the client to analyse.
    """
    data = await _post(f"/api/consult/analyze-gaps/{client_id}")
    return _fmt(data)


@mcp.tool()
async def get_next_steps(client_id: str) -> str:
    """Get prioritised next steps for a client's licensing journey.

    Returns ordered action items with categories, estimated days,
    dependencies, and regulatory references.

    Args:
        client_id: The UUID of the client.
    """
    data = await _post(f"/api/consult/next-steps/{client_id}")
    return _fmt(data)


# ---------------------------------------------------------------------------
# AI Consultant (non-streaming — collects full response)
# ---------------------------------------------------------------------------

@mcp.tool()
async def consult(
    message: str,
    client_id: str | None = None,
    conversation_history: list[dict[str, str]] | None = None,
) -> str:
    """Chat with the AI compliance consultant about Swiss financial regulations.

    The consultant is powered by Claude and has access to the regulatory
    knowledge base. It can answer questions about licensing requirements,
    AML/KYC obligations, capital requirements, and more.

    For client-specific advice, provide a client_id to scope the conversation.

    Note: This collects the full streamed response (SSE) into a single string.

    Args:
        message: Your question or message to the consultant.
        client_id: Optional client UUID to scope advice to a specific client.
        conversation_history: Optional prior messages as [{"role": "user"|"assistant", "content": "..."}].
    """
    body: dict[str, Any] = {"message": message}
    if client_id:
        body["client_id"] = client_id
    if conversation_history:
        body["conversation_history"] = conversation_history

    # The /api/consult/chat endpoint streams SSE. We collect all data events.
    chunks: list[str] = []
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream(
            "POST", _url("/api/consult/chat"), json=body
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    chunk = line[6:]
                    if chunk.strip() == "[DONE]":
                        break
                    chunks.append(chunk)

    return "".join(chunks) if chunks else "(No response from consultant)"


# ---------------------------------------------------------------------------
# Onboarding Tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def start_onboarding() -> str:
    """Start a new client onboarding session.

    Creates a new client and returns the client_id. Use this before calling
    onboard_chat to begin the guided intake process.
    """
    data = await _post("/api/onboard/start")
    return _fmt(data)


@mcp.tool()
async def onboard_chat(client_id: str, message: str) -> str:
    """Continue an onboarding conversation with the AI intake assistant.

    The assistant will guide the user through providing company details,
    determining the appropriate regulatory pathway, and building the initial
    compliance checklist.

    Note: Collects the full SSE stream into a single response.

    Args:
        client_id: The client UUID from start_onboarding.
        message: The user's response in the onboarding conversation.
    """
    body = {"client_id": client_id, "message": message}
    chunks: list[str] = []
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream(
            "POST", _url("/api/onboard/chat"), json=body
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    chunk = line[6:]
                    if chunk.strip() == "[DONE]":
                        break
                    chunks.append(chunk)

    return "".join(chunks) if chunks else "(No response from onboarding assistant)"


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@mcp.tool()
async def health_check() -> str:
    """Check if the Darcy API backend is healthy and responding."""
    data = await _get("/health")
    return _fmt(data)


# ---------------------------------------------------------------------------
# Resources (read-only context for MCP clients)
# ---------------------------------------------------------------------------

@mcp.resource("darcy://licence-types")
async def licence_types_resource() -> str:
    """Overview of the 5 Swiss financial licence types supported by Darcy."""
    return json.dumps({
        "licence_types": [
            {
                "name": "Banking",
                "legal_basis": "Art. 3 BankA",
                "pathway": "finma_banking",
                "min_capital_chf": 10_000_000,
                "approx_documents": 88,
                "stages": 6,
            },
            {
                "name": "Fintech",
                "legal_basis": "Art. 1b BankA",
                "pathway": "finma_fintech",
                "min_capital_chf": 300_000,
                "approx_documents": 65,
                "stages": 6,
            },
            {
                "name": "Securities Firm",
                "legal_basis": "FinIA",
                "pathway": "finma_securities",
                "min_capital_chf": 1_500_000,
                "approx_documents": 70,
                "stages": 6,
            },
            {
                "name": "Fund Management",
                "legal_basis": "CISA",
                "pathway": "finma_fund_management",
                "min_capital_chf": 1_000_000,
                "approx_documents": 60,
                "stages": 6,
            },
            {
                "name": "Insurance",
                "legal_basis": "ISA",
                "pathway": "finma_insurance",
                "min_capital_chf": None,
                "approx_documents": 35,
                "stages": 6,
            },
        ],
        "stages": [
            "Pre-Consultation",
            "Application Preparation",
            "Formal Submission",
            "Completeness Check",
            "In-Depth Review",
            "Decision & Licence Grant",
        ],
    }, indent=2)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run()
