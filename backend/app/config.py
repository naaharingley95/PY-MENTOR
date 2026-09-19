"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # JWT
    jwt_secret_key: str = "change-me-to-a-random-secret-string"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    refresh_token_expire_days: int = 30

    # Database
    database_url: str = "sqlite+aiosqlite:///./pymentor.db"

    # Gemini
    gemini_api_key: str = "your-gemini-api-key-here"
    gemini_model: str = "gemini-2.0-flash"

    # CORS
    frontend_url: str = "http://localhost:5173"

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
