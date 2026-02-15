"""Client CRUD endpoints."""

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.models.client import Client
from src.services import client_store

router = APIRouter(prefix="/api/clients", tags=["clients"])


class ClientListItem(BaseModel):
    id: str
    company_name: str
    status: str
    pathway: str | None
    created_at: str
    updated_at: str


class ChecklistItemUpdate(BaseModel):
    status: str
    notes: str | None = None


@router.post("")
async def create_client(body: dict[str, Any]) -> Client:
    """Create a new client with optional initial data."""
    import uuid

    client_id = str(uuid.uuid4())
    data: dict[str, Any] = {"id": client_id}
    data.update(body)
    client = Client.model_validate(data)
    await client_store.save_client(client)
    return client


@router.get("")
async def list_clients() -> list[ClientListItem]:
    """List all clients."""
    clients = await client_store.list_clients()
    return [
        ClientListItem(
            id=c.id,
            company_name=c.company_name,
            status=c.status,
            pathway=c.pathway,
            created_at=c.created_at.isoformat(),
            updated_at=c.updated_at.isoformat(),
        )
        for c in clients
    ]


@router.get("/{client_id}")
async def get_client(client_id: str) -> Client:
    """Get full client detail."""
    client = await client_store.get_client(client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.patch("/{client_id}")
async def update_client(client_id: str, body: dict[str, Any]) -> Client:
    """Update client fields."""
    client = await client_store.update_client(client_id, body)
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
            item.status = body.status  # type: ignore[assignment]
            if body.notes is not None:
                item.notes = body.notes
            from datetime import datetime

            client.updated_at = datetime.utcnow()
            await client_store.save_client(client)
            return client
    raise HTTPException(status_code=404, detail="Checklist item not found")
