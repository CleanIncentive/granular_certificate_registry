from typing import List

from pydantic import BaseModel
from sqlalchemy import ARRAY, Column, Integer
from sqlmodel import Field

from gc_registry import utils


class AccountBase(utils.ActiveRecord):
    account_name: str
    user_ids: List[int | None] = Field(
        default=[],
        description="The users registered to the account.",
        sa_column=Column(ARRAY(Integer())),
    )
    is_deleted: bool = Field(default=False)


class AccountUpdate(BaseModel):
    account_name: str | None = None
    user_ids: List[int | None] = []


class AccountWhitelist(BaseModel):
    add_to_whitelist: List[int] | None = None
    remove_from_whitelist: List[int] | None = None


class AccountSummary(BaseModel):
    id: int
    account_name: str
    num_devices: int
    num_granular_certificate_bundles: int
    total_certificate_energy: int
    energy_by_fuel_type: dict[str, int] | None = None


class AccountWhitelistLinkBase(utils.ActiveRecord):
    target_account_id: int
    source_account_id: int
    is_deleted: bool = Field(default=False)
