"""Chat session model for persistent conversations."""

from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class ChatSession(BaseModel):
    id: str
    client_id: str | None = None
    title: str = "New conversation"
    messages: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
