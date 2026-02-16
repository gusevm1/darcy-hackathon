from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings

_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://darcy-hackathon.vercel.app",
]


def _get_origins() -> list[str]:
    """Return allowed CORS origins from env or fall back to defaults."""
    if settings.cors_origins:
        return [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    origins = list(_DEFAULT_ORIGINS)
    if settings.frontend_url and settings.frontend_url not in origins:
        origins.insert(0, settings.frontend_url)
    return origins


def add_cors(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_get_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Content-Type", "Cache-Control", "X-Accel-Buffering"],
    )
