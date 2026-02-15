"""File storage and SQLite CRUD for client document uploads."""

import uuid
from pathlib import Path

import aiosqlite

from src.models.client import ClientDocument

DB_PATH = Path(__file__).parent.parent.parent / "data" / "clients.db"
UPLOAD_DIR = Path(__file__).parent.parent.parent / "data" / "client_uploads"


def _upload_path(client_id: str, filename: str) -> Path:
    """Return the storage path for a client upload."""
    safe_name = f"{uuid.uuid4().hex[:12]}-{filename}"
    return UPLOAD_DIR / client_id / safe_name


async def _get_db() -> aiosqlite.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = await aiosqlite.connect(str(DB_PATH))
    db.row_factory = aiosqlite.Row
    return db


async def save_document(doc: ClientDocument) -> None:
    db = await _get_db()
    try:
        await db.execute(
            """INSERT OR REPLACE INTO client_documents
               (id, client_id, document_id, file_name, file_path,
                content_type, file_size, status, verification_result,
                uploaded_at, verified_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                doc.id,
                doc.client_id,
                doc.document_id,
                doc.file_name,
                doc.file_path,
                doc.content_type,
                doc.file_size,
                doc.status,
                doc.verification_result,
                doc.uploaded_at.isoformat(),
                doc.verified_at.isoformat() if doc.verified_at else None,
            ),
        )
        await db.commit()
    finally:
        await db.close()


async def get_document(client_id: str, document_id: str) -> ClientDocument | None:
    db = await _get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM client_documents WHERE client_id = ? AND document_id = ?",
            (client_id, document_id),
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return _row_to_doc(row)
    finally:
        await db.close()


async def get_document_by_id(doc_id: str) -> ClientDocument | None:
    db = await _get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM client_documents WHERE id = ?", (doc_id,)
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return _row_to_doc(row)
    finally:
        await db.close()


async def list_documents(client_id: str) -> list[ClientDocument]:
    db = await _get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM client_documents WHERE client_id = ?"
            " ORDER BY uploaded_at DESC",
            (client_id,),
        )
        rows = await cursor.fetchall()
        return [_row_to_doc(r) for r in rows]
    finally:
        await db.close()


async def delete_document(client_id: str, document_id: str) -> bool:
    doc = await get_document(client_id, document_id)
    if doc is None:
        return False
    # Remove file from disk
    file_path = Path(doc.file_path)
    if file_path.exists():
        file_path.unlink(missing_ok=True)
    db = await _get_db()
    try:
        cursor = await db.execute(
            "DELETE FROM client_documents WHERE client_id = ? AND document_id = ?",
            (client_id, document_id),
        )
        await db.commit()
        return cursor.rowcount > 0
    finally:
        await db.close()


async def update_status(
    client_id: str,
    document_id: str,
    status: str,
    verification_result: str | None = None,
    verified_at: str | None = None,
) -> ClientDocument | None:
    db = await _get_db()
    try:
        await db.execute(
            """UPDATE client_documents
               SET status = ?, verification_result = ?, verified_at = ?
               WHERE client_id = ? AND document_id = ?""",
            (status, verification_result, verified_at, client_id, document_id),
        )
        await db.commit()
    finally:
        await db.close()
    return await get_document(client_id, document_id)


async def store_file(
    client_id: str, document_id: str, file_name: str, content: bytes, content_type: str
) -> ClientDocument:
    """Store an uploaded file and create a DB record."""
    # Remove any previous upload for this slot
    await delete_document(client_id, document_id)

    dest = _upload_path(client_id, file_name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(content)

    doc = ClientDocument(
        id=uuid.uuid4().hex[:16],
        client_id=client_id,
        document_id=document_id,
        file_name=file_name,
        file_path=str(dest),
        content_type=content_type,
        file_size=len(content),
    )
    await save_document(doc)
    return doc


def _row_to_doc(row: aiosqlite.Row) -> ClientDocument:
    from datetime import datetime

    verified_at = None
    if row["verified_at"]:
        verified_at = datetime.fromisoformat(row["verified_at"])

    return ClientDocument(
        id=row["id"],
        client_id=row["client_id"],
        document_id=row["document_id"],
        file_name=row["file_name"],
        file_path=row["file_path"],
        content_type=row["content_type"],
        file_size=row["file_size"],
        status=row["status"],
        verification_result=row["verification_result"],
        uploaded_at=datetime.fromisoformat(row["uploaded_at"]),
        verified_at=verified_at,
    )
