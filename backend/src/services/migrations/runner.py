"""Simple numbered SQL migration runner for SQLite."""

import logging
from pathlib import Path

import aiosqlite

logger = logging.getLogger(__name__)

SQL_DIR = Path(__file__).parent / "sql"


async def run_migrations(db_path: Path) -> None:
    """Run all pending migrations against the given SQLite database."""
    db_path.parent.mkdir(parents=True, exist_ok=True)
    db = await aiosqlite.connect(str(db_path))
    try:
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS _migrations (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                applied_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        await db.commit()

        cursor = await db.execute("SELECT name FROM _migrations")
        rows = await cursor.fetchall()
        applied = {row[0] for row in rows}

        sql_files = sorted(SQL_DIR.glob("*.sql"))
        for sql_file in sql_files:
            if sql_file.name in applied:
                continue
            logger.info("Applying migration: %s", sql_file.name)
            sql = sql_file.read_text()
            await db.executescript(sql)
            await db.execute(
                "INSERT INTO _migrations (name) VALUES (?)", (sql_file.name,)
            )
            await db.commit()
            logger.info("Applied migration: %s", sql_file.name)
    finally:
        await db.close()
