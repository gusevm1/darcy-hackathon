"""SQLite-backed client storage."""

import logging
from typing import Any

from src.models.client import Client
from src.services.db import DB_PATH, get_db

logger = logging.getLogger(__name__)


async def init_db() -> None:
    from src.services.migrations.runner import run_migrations

    await run_migrations(DB_PATH)


async def save_client(client: Client) -> None:
    db = await get_db()
    try:
        await db.execute(
            "INSERT OR REPLACE INTO clients (id, data) VALUES (?, ?)",
            (client.id, client.model_dump_json()),
        )
        await db.commit()
    finally:
        await db.close()


async def get_client(client_id: str) -> Client | None:
    db = await get_db()
    try:
        cursor = await db.execute("SELECT data FROM clients WHERE id = ?", (client_id,))
        row = await cursor.fetchone()
        if row is None:
            return None
        return Client.model_validate_json(row[0])
    finally:
        await db.close()


async def list_clients(skip: int = 0, limit: int = 50) -> tuple[list[Client], int]:
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT data FROM clients ORDER BY rowid DESC LIMIT ? OFFSET ?",
            (limit, skip),
        )
        rows = await cursor.fetchall()
        clients: list[Client] = []
        for row in rows:
            try:
                clients.append(Client.model_validate_json(row[0]))
            except Exception:
                logger.warning("Skipping malformed client row: %s", row[0][:80])
        return clients, len(clients)
    finally:
        await db.close()


async def update_client(client_id: str, updates: dict[str, Any]) -> Client | None:
    client = await get_client(client_id)
    if client is None:
        return None
    data = client.model_dump()
    for key, value in updates.items():
        if key in data:
            data[key] = value
    from datetime import UTC, datetime

    data["updated_at"] = datetime.now(UTC)
    updated = Client.model_validate(data)
    await save_client(updated)
    return updated


DEMO_CLIENT_ID = "thomas-muller"


async def seed_demo_client() -> None:
    """Create the Thomas Müller demo client if not already present."""
    from src.services.checklist_templates import get_checklist_for_pathway

    existing = await get_client(DEMO_CLIENT_ID)
    if existing is not None:
        return

    checklist = get_checklist_for_pathway("finma_banking")
    # Mark first 15 items as complete, next 5 as in_progress
    for i, item in enumerate(checklist):
        if i < 15:
            item.status = "complete"
        elif i < 20:
            item.status = "in_progress"

    demo = Client(
        id=DEMO_CLIENT_ID,
        company_name="Alpine Digital Bank AG",
        contact_name="Thomas Müller",
        contact_email="thomas.muller@alpinedigital.ch",
        status="in_progress",
        pathway="finma_banking",
        finma_license_type="banking",
        current_stage_index=2,
        legal_structure="AG",
        establishment_canton="Zurich",
        has_swiss_office=True,
        has_swiss_director=True,
        # Business profile
        business_description=(
            "Digital banking platform offering deposit accounts, "
            "payment services, and SME lending to Swiss businesses "
            "and retail customers."
        ),
        services=["deposit_taking", "lending", "payment_services"],
        handles_fiat=True,
        handles_client_assets=True,
        client_types=["retail", "sme"],
        existing_capital_chf=12_000_000,
        minimum_capital_chf=10_000_000,
        # Compliance profile
        has_aml_officer=True,
        aml_officer_swiss_resident=True,
        has_external_auditor=True,
        has_aml_kyc_policies=True,
        has_transaction_monitoring=True,
        has_sanctions_screening=True,
        # Checklist with progress
        checklist=checklist,
    )
    await save_client(demo)


async def delete_client(client_id: str) -> bool:
    db = await get_db()
    try:
        cursor = await db.execute("DELETE FROM clients WHERE id = ?", (client_id,))
        await db.commit()
        return cursor.rowcount > 0
    finally:
        await db.close()
