import logging
import os
from typing import Optional, Union

from google.cloud import secretmanager
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_secret(secret_name: str) -> str:
    """
    Fetches a secret from Google Cloud Secret Manager.
    """
    client = secretmanager.SecretManagerServiceClient()
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    if not project_id:
        raise ValueError("GOOGLE_CLOUD_PROJECT environment variable not set")
    secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(name=secret_path)
    return response.payload.data.decode("UTF-8")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "CI")

    # Define all secrets as optional initially
    DATABASE_HOST_READ: Optional[str] = None
    DATABASE_HOST_WRITE: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    ESDB_CONNECTION_STRING: Optional[str] = None
    FRONTEND_URL: Optional[str] = os.getenv("FRONTEND_URL", "localhost:3000")

    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")  # Must be set in environment
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    MIDDLEWARE_SECRET_KEY: str = os.getenv("MIDDLEWARE_SECRET_KEY", "")  # Must be set in environment

    # Other configuration
    DATABASE_PORT: int = int(os.getenv("DATABASE_PORT", "5432"))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "registry")
    CERTIFICATE_GRANULARITY_HOURS: float = float(os.getenv("CERTIFICATE_GRANULARITY_HOURS", "1"))
    CERTIFICATE_EXPIRY_YEARS: int = int(os.getenv("CERTIFICATE_EXPIRY_YEARS", "2"))
    CAPACITY_MARGIN: float = float(os.getenv("CAPACITY_MARGIN", "1.1"))
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_WARNING_MINS: int = int(os.getenv("REFRESH_WARNING_MINS", "5"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    PROFILING_ENABLED: bool = os.getenv("PROFILING_ENABLED", "").lower() == "true"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Validate required secrets in non-CI environments
        if self.ENVIRONMENT != "CI":
            if not self.JWT_SECRET_KEY or not self.MIDDLEWARE_SECRET_KEY:
                raise ValueError("JWT_SECRET_KEY and MIDDLEWARE_SECRET_KEY must be set in environment")

        if self.ENVIRONMENT == "PROD":
            try:
                self.DATABASE_HOST_READ = get_secret("DATABASE_HOST_READ")
                self.DATABASE_HOST_WRITE = get_secret("DATABASE_HOST_WRITE")
                self.POSTGRES_USER = get_secret("POSTGRES_USER")
                self.POSTGRES_PASSWORD = get_secret("POSTGRES_PASSWORD")
                self.ESDB_CONNECTION_STRING = get_secret("ESDB_CONNECTION_STRING")
                self.FRONTEND_URL = get_secret("FRONTEND_URL")
                self.JWT_SECRET_KEY = get_secret("JWT_SECRET_KEY")
                self.JWT_ALGORITHM = get_secret("JWT_ALGORITHM")
                self.MIDDLEWARE_SECRET_KEY = get_secret("MIDDLEWARE_SECRET_KEY")
            except Exception as e:
                logging.error(f"Error fetching secrets: {e}")
                raise ValueError("Failed to load required secrets from Google Cloud Secret Manager")


settings = Settings()
