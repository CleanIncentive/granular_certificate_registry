from pydantic import BaseModel
from sqlmodel import Field

from gc_registry.account.schemas import AccountRead
from gc_registry.core.models.base import UserRoles


class UserBase(BaseModel):
    name: str
    primary_contact: str
    role: UserRoles = Field(
        description="""The role of the User within the registry. A single User is assigned a role
                       by the Registry Administrator (which is itself a User for the purposes of managing allowable
                       actions), including: 'Admin', 'Audit User', 'Trading User',
                       and 'Production User'. The roles are used to determine the actions that the User is allowed
                       to perform within the registry, according to the EnergyTag Standard.""",
    )
    hashed_password: str | None = None
    is_deleted: bool = Field(default=False)


class UserUpdate(BaseModel):
    name: str | None = None
    primary_contact: str | None = None
    account_ids: list[int] | None = None
    organisation: str | None = None
    hashed_password: str | None = None
    role: UserRoles | None = None


class UserRead(BaseModel):
    id: int
    name: str
    primary_contact: str
    role: UserRoles
    accounts: list[AccountRead] | None = None
    organisation: str | None = None
