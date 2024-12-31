import datetime

from sqlmodel import Field

from gc_registry import utils


class TokenRecords(utils.ActiveRecord, table=True):
    user_name: str = Field(primary_key=True, default="anonymous")
    token: str = Field(primary_key=True)
    expires: datetime.datetime = Field(
        primary_key=True,
        default=datetime.datetime.now(tz=datetime.timezone.utc)
        + datetime.timedelta(minutes=15),
    )
