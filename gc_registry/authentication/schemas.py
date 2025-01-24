import datetime

from sqlmodel import Field, SQLModel

from gc_registry import utils


class Token(SQLModel):
    access_token: str
    token_type: str
    user_id: int


class TokenRecordsBase(utils.ActiveRecord):
    email: str = Field(nullable=False)
    token: str
    expires: datetime.datetime = Field(
        default=datetime.datetime.now(tz=datetime.timezone.utc)
        + datetime.timedelta(minutes=15),
    )
