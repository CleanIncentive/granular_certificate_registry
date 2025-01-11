import datetime

from sqlmodel import Field, SQLModel

from gc_registry import utils


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenRecordsBase(utils.ActiveRecord):
    user_name: str = Field(default="anonymous")
    token: str
    expires: datetime.datetime = Field(
        default=datetime.datetime.now(tz=datetime.timezone.utc)
        + datetime.timedelta(minutes=15),
    )
