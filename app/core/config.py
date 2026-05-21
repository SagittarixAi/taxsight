"""Application configuration."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """TaxSight application settings."""
    APP_NAME: str = "TaxSight API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://taxsight:taxsight@localhost:5432/taxsight"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://taxsight.ai",
        "https://www.taxsight.ai",
    ]

    # Upload
    MAX_UPLOAD_SIZE_MB: int = 10
    UPLOAD_DIR: str = "/tmp/taxsight-uploads"

    # Supabase
    SUPABASE_URL: str | None = None
    SUPABASE_ANON_KEY: str | None = None
    SUPABASE_SERVICE_KEY: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
