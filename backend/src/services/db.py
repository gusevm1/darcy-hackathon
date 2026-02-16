"""Shared SQLite database connection helper."""

from pathlib import Path

import aiosqlite

DB_PATH = Path(__file__).parent.parent.parent / "data" / "clients.db"


async def get_db() -> aiosqlite.Connection:
    """Open a connection to the shared SQLite database."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = await aiosqlite.connect(str(DB_PATH))
    db.row_factory = aiosqlite.Row
    return db
