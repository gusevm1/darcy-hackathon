"""Chat models for the Claude-powered regulatory assistant."""

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class CitationSource(BaseModel):
    text: str
    article: str


class ChatResponse(BaseModel):
    content: str
    citations: list[CitationSource]
