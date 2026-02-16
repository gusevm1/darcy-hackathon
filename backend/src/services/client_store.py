"""SQLite-backed client storage."""

from typing import Any

from src.models.client import Client
from src.services.db import DB_PATH, get_db


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
        count_cursor = await db.execute("SELECT COUNT(*) FROM clients")
        count_row = await count_cursor.fetchone()
        total = count_row[0] if count_row else 0

        cursor = await db.execute(
            "SELECT data FROM clients ORDER BY rowid DESC LIMIT ? OFFSET ?",
            (limit, skip),
        )
        rows = await cursor.fetchall()
        clients = [Client.model_validate_json(row[0]) for row in rows]
        return clients, total
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
    existing = await get_client(DEMO_CLIENT_ID)
    if existing is not None:
        return
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
