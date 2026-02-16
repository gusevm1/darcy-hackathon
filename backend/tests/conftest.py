import asyncio
import os
import tempfile
from pathlib import Path

os.environ.setdefault("ANTHROPIC_API_KEY", "test-key")
os.environ.setdefault("OPENAI_API_KEY", "test-key")
os.environ.setdefault("API_KEY", "")  # Disable auth in tests
os.environ.setdefault("APP_ENV", "test")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

# Patch DB_PATH to a temp file BEFORE importing modules that use it
_tmp_dir = tempfile.mkdtemp()
_test_db_path = Path(_tmp_dir) / "test_clients.db"

import src.services.db as db_mod  # noqa: E402

db_mod.DB_PATH = _test_db_path

from src.main import app  # noqa: E402
from src.services.migrations.runner import run_migrations  # noqa: E402


def _run_migrations() -> None:
    loop = asyncio.new_event_loop()
    loop.run_until_complete(run_migrations(_test_db_path))
    loop.close()


_run_migrations()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
