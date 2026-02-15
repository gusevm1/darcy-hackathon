from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    frontend_url: str = "http://localhost:3000"
    anthropic_api_key: str = Field(min_length=1)

    # Qdrant
    qdrant_url: str = "http://localhost:6333"
    qdrant_collection: str = "regulatory_docs"

    # OpenAI (embeddings only)
    openai_api_key: str = Field(min_length=1)
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @field_validator("app_env")
    @classmethod
    def validate_app_env(cls, v: str) -> str:
        allowed: set[str] = {"development", "production", "test"}
        if v not in allowed:
            msg = f"app_env must be one of {allowed}, got '{v}'"
            raise ValueError(msg)
        return v


settings = Settings()  # type: ignore[call-arg]  # populated by env vars
