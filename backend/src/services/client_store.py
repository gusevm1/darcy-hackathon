"""SQLite-backed client storage."""

from pathlib import Path
from typing import Any

import aiosqlite

from src.models.client import Client

DB_PATH = Path(__file__).parent.parent.parent / "data" / "clients.db"


async def _get_db() -> aiosqlite.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = await aiosqlite.connect(str(DB_PATH))
    db.row_factory = aiosqlite.Row
    return db


async def init_db() -> None:
    from src.services.migrations.runner import run_migrations

    await run_migrations(DB_PATH)


async def save_client(client: Client) -> None:
    db = await _get_db()
    try:
        await db.execute(
            "INSERT OR REPLACE INTO clients (id, data) VALUES (?, ?)",
            (client.id, client.model_dump_json()),
        )
        await db.commit()
    finally:
        await db.close()


async def get_client(client_id: str) -> Client | None:
    db = await _get_db()
    try:
        cursor = await db.execute("SELECT data FROM clients WHERE id = ?", (client_id,))
        row = await cursor.fetchone()
        if row is None:
            return None
        return Client.model_validate_json(row[0])
    finally:
        await db.close()


async def list_clients(skip: int = 0, limit: int = 50) -> tuple[list[Client], int]:
    db = await _get_db()
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
    from datetime import datetime

    data["updated_at"] = datetime.utcnow()
    updated = Client.model_validate(data)
    await save_client(updated)
    return updated


async def delete_client(client_id: str) -> bool:
    db = await _get_db()
    try:
        cursor = await db.execute("DELETE FROM clients WHERE id = ?", (client_id,))
        await db.commit()
        return cursor.rowcount > 0
    finally:
        await db.close()
