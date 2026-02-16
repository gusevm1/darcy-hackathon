"""Tests for dependency injection (get_rag_service)."""

from unittest.mock import MagicMock

from src.services.rag_service import RAGService, _default_instance, get_rag_service
from starlette.datastructures import State
from starlette.requests import Request


def _make_request(state: State) -> Request:
    """Build a minimal fake Request with the given app state."""
    scope = {
        "type": "http",
        "method": "GET",
        "path": "/",
        "app": MagicMock(state=state),
    }
    return Request(scope)


def test_get_rag_service_returns_default_when_no_app_state() -> None:
    """When app.state has no rag_service attr, return the module default."""
    state = State()  # empty — no rag_service attribute
    request = _make_request(state)
    result = get_rag_service(request)
    assert result is _default_instance


def test_get_rag_service_returns_instance_from_app_state() -> None:
    """When app.state.rag_service is set, return that instance."""
    custom = RAGService()
    state = State()
    state.rag_service = custom
    request = _make_request(state)
    result = get_rag_service(request)
    assert result is custom
    assert result is not _default_instance
