"""SQLite-backed CRUD for chat sessions."""

import json
import uuid
from datetime import UTC, datetime

import aiosqlite

from src.models.chat_session import ChatSession
from src.services.db import get_db


async def create_session(client_id: str | None = None) -> ChatSession:
    session = ChatSession(
        id=uuid.uuid4().hex[:16],
        client_id=client_id,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO chat_sessions
               (id, client_id, title, messages, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                session.id,
                session.client_id,
                session.title,
                json.dumps(session.messages),
                session.created_at.isoformat(),
                session.updated_at.isoformat(),
            ),
        )
        await db.commit()
    finally:
        await db.close()
    return session


async def get_session(session_id: str) -> ChatSession | None:
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM chat_sessions WHERE id = ?", (session_id,)
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return _row_to_session(row)
    finally:
        await db.close()


async def list_sessions(client_id: str | None = None) -> list[ChatSession]:
    db = await get_db()
    try:
        if client_id:
            cursor = await db.execute(
                "SELECT * FROM chat_sessions WHERE client_id = ?"
                " ORDER BY updated_at DESC",
                (client_id,),
            )
        else:
            cursor = await db.execute(
                "SELECT * FROM chat_sessions ORDER BY updated_at DESC"
            )
        rows = await cursor.fetchall()
        return [_row_to_session(r) for r in rows]
    finally:
        await db.close()


async def update_session(
    session_id: str,
    messages: list[dict[str, str]] | None = None,
    title: str | None = None,
) -> ChatSession | None:
    session = await get_session(session_id)
    if session is None:
        return None
    db = await get_db()
    try:
        now = datetime.now(UTC).isoformat()
        if messages is not None:
            await db.execute(
                "UPDATE chat_sessions SET messages = ?, updated_at = ? WHERE id = ?",
                (json.dumps(messages), now, session_id),
            )
        if title is not None:
            await db.execute(
                "UPDATE chat_sessions SET title = ?, updated_at = ? WHERE id = ?",
                (title, now, session_id),
            )
        await db.commit()
    finally:
        await db.close()
    return await get_session(session_id)


async def delete_session(session_id: str) -> bool:
    db = await get_db()
    try:
        cursor = await db.execute(
            "DELETE FROM chat_sessions WHERE id = ?", (session_id,)
        )
        await db.commit()
        return cursor.rowcount > 0
    finally:
        await db.close()


def _row_to_session(row: aiosqlite.Row) -> ChatSession:
    return ChatSession(
        id=row["id"],
        client_id=row["client_id"],
        title=row["title"],
        messages=json.loads(row["messages"]),
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
    )
