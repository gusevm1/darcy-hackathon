"""Client CRUD endpoints."""

import uuid
from datetime import datetime
from typing import Any, Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict

from src.models.client import Client
from src.models.pagination import PaginatedResponse
from src.services import client_store

router = APIRouter(prefix="/api/clients", tags=["clients"])


class ClientCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company_name: str = ""
    contact_name: str | None = None
    contact_email: str | None = None
    current_stage_index: int | None = None
    finma_license_type: str | None = None
    business_description: str | None = None
    legal_structure: Literal["AG", "GmbH", "other"] | None = None
    establishment_canton: str | None = None
    has_swiss_office: bool | None = None
    has_swiss_director: bool | None = None
    services: list[str] | None = None
    handles_fiat: bool | None = None
    handles_client_assets: bool | None = None
    client_types: list[str] | None = None
    cross_border_activities: bool | None = None


class ClientUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company_name: str | None = None
    contact_name: str | None = None
    contact_email: str | None = None
    current_stage_index: int | None = None
    finma_license_type: str | None = None
    business_description: str | None = None
    legal_structure: Literal["AG", "GmbH", "other"] | None = None
    establishment_canton: str | None = None
    has_swiss_office: bool | None = None
    has_swiss_director: bool | None = None
    services: list[str] | None = None
    handles_fiat: bool | None = None
    handles_client_assets: bool | None = None
    client_types: list[str] | None = None
    cross_border_activities: bool | None = None
    existing_capital_chf: int | None = None
    has_aml_officer: bool | None = None
    aml_officer_swiss_resident: bool | None = None
    has_external_auditor: bool | None = None
    has_aml_kyc_policies: bool | None = None
    has_transaction_monitoring: bool | None = None
    has_sanctions_screening: bool | None = None


class ClientListItem(BaseModel):
    id: str
    company_name: str
    status: str
    pathway: str | None
    finma_license_type: str | None = None
    contact_name: str = ""
    contact_email: str = ""
    current_stage_index: int = 0
    created_at: str
    updated_at: str


class ChecklistItemUpdate(BaseModel):
    status: Literal[
        "not_started", "in_progress", "complete", "blocked", "not_applicable"
    ]
    notes: str | None = None


@router.post("")
async def create_client(body: ClientCreateRequest) -> Client:
    """Create a new client with optional initial data."""
    client_id = str(uuid.uuid4())
    data: dict[str, Any] = {"id": client_id}
    data.update(body.model_dump(exclude_unset=True))
    client = Client.model_validate(data)
    await client_store.save_client(client)
    return client


@router.get("")
async def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> PaginatedResponse[ClientListItem]:
    """List all clients."""
    clients, total = await client_store.list_clients(skip=skip, limit=limit)
    items = [
        ClientListItem(
            id=c.id,
            company_name=c.company_name,
            status=c.status,
            pathway=c.pathway,
            finma_license_type=c.finma_license_type,
            contact_name=c.contact_name,
            contact_email=c.contact_email,
            current_stage_index=c.current_stage_index,
            created_at=c.created_at.isoformat(),
            updated_at=c.updated_at.isoformat(),
        )
        for c in clients
    ]
    return PaginatedResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{client_id}")
async def get_client(client_id: str) -> Client:
    """Get full client detail."""
    client = await client_store.get_client(client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.patch("/{client_id}")
async def update_client(client_id: str, body: ClientUpdateRequest) -> Client:
    """Update client fields."""
    updates = body.model_dump(exclude_unset=True)
    client = await client_store.update_client(client_id, updates)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.patch("/{client_id}/checklist/{item_id}")
async def update_checklist_item(
    client_id: str, item_id: str, body: ChecklistItemUpdate
) -> Client:
    """Update a checklist item status."""
    client = await client_store.get_client(client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    for item in client.checklist:
        if item.id == item_id:
            item.status = body.status
            if body.notes is not None:
                item.notes = body.notes
            client.updated_at = datetime.utcnow()
            await client_store.save_client(client)
            return client
    raise HTTPException(status_code=404, detail="Checklist item not found")
