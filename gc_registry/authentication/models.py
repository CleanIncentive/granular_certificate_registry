from sqlmodel import Field

from gc_registry.authentication.schemas import TokenRecordsBase


class TokenRecords(TokenRecordsBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
