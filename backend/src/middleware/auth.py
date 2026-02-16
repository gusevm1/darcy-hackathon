"""API key authentication middleware."""

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader

from src.config import settings

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(
    api_key: str | None = Security(_api_key_header),
) -> None:
    """Validate the X-API-Key header against the configured secret.

    If settings.api_key is empty, authentication is disabled (open access).
    """
    if not settings.api_key:
        return
    if api_key is None or api_key != settings.api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )


require_api_key = Depends(verify_api_key)
