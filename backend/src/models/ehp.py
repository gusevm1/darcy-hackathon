"""EHP (Electronic Hub Platform) comment models."""

from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, Field


class EHPComment(BaseModel):
    id: str
    client_id: str
    document_id: str  # matches RequiredDocument.id (e.g., "banking-1-1")
    author: str
    role: Literal["finma-reviewer", "applicant", "consultant", "auditor"]
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    resolved: bool = False
    ai_generated: bool = False


class EHPCommentCreate(BaseModel):
    author: str
    role: Literal["finma-reviewer", "applicant", "consultant", "auditor"]
    content: str
