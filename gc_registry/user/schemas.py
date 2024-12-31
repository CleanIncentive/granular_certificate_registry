from typing import List

from sqlalchemy import ARRAY, Column, String
from sqlmodel import Field

from gc_registry import utils
from gc_registry.core.models.base import UserRoles


class UserBase(utils.ActiveRecord):
    name: str
    primary_contact: str
    roles: List[UserRoles] = Field(
        description="""The roles of the User with the registry. A single User can be assigned multiple roles
                       by the Registry Administrator (which is itself a User for the purposes of managing allowable
                       actions), including: 'Admin', 'Audit User', 'Trading User',
                       and 'Production User'. The roles are used to determine the actions that the User is allowed
                       to perform within the registry, according to the EnergyTag Standard.""",
        sa_column=Column(ARRAY(String())),
    )
    hashed_password: str | None = None
    is_deleted: bool = Field(default=False)
