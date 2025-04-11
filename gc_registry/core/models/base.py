from datetime import datetime, timezone
from enum import Enum
from functools import partial
from typing import Any, Dict, List, Optional, Union
import uuid

from pydantic import BaseModel, Field
from sqlalchemy import JSON, Column
from sqlmodel import Field

utc_datetime_now = partial(datetime.now, timezone.utc)


class UserRoles(int, Enum):
    ADMIN = 4
    PRODUCTION_USER = 3
    TRADING_USER = 2
    AUDIT_USER = 1

    def __str__(self):
        return self.name.lower()


class DeviceTechnologyType(str, Enum):
    solar_pv = "solar_pv"
    wind_turbine = "wind_turbine"
    hydro = "hydro"
    battery_storage = "battery_storage"
    other_storage = "other_storage"
    chp = "chp"
    other = "other"

    @classmethod
    def values(cls):
        return [e.value for e in cls]


class EnergySourceType(str, Enum):
    solar_pv = "solar_pv"
    wind = "wind"
    hydro = "hydro"
    biomass = "biomass"
    nuclear = "nuclear"
    electrolysis = "electrolysis"
    geothermal = "geothermal"
    battery_storage = "battery_storage"
    chp = "chp"
    other = "other"


class EnergyCarrierType(str, Enum):
    electricity = "electricity"
    natural_gas = "natural_gas"
    hydrogen = "hydrogen"
    heat = "heat"
    other = "other"


class CertificateStatus(str, Enum):
    ACTIVE = "Active"
    CANCELLED = "Cancelled"
    CLAIMED = "Claimed"
    EXPIRED = "Expired"
    WITHDRAWN = "Withdrawn"
    LOCKED = "Locked"
    RESERVED = "Reserved"
    BUNDLE_SPLIT = "Bundle Split"


class CertificateActionType(str, Enum):
    TRANSFER = "transfer"
    RECURRING_TRANSFER = "recurring_transfer"
    CANCEL = "cancel"
    RECURRING_CANCEL = "recurring_cancel"
    CLAIM = "claim"
    RECURRING_CLAIM = "recurring_claim"
    WITHDRAW = "withdraw"
    LOCK = "lock"
    RESERVE = "reserve"


class EventTypes(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class Event(BaseModel):
    entity_id: Union[int, uuid.UUID]
    entity_name: str
    attributes_before: Union[dict, None] = Field(sa_column=Column(JSON))
    attributes_after: Union[dict, None] = Field(sa_column=Column(JSON))
    timestamp: datetime = Field(default_factory=utc_datetime_now)  # type: ignore
    event_type: EventTypes
    event_data: Dict[str, Any]
    version: int = 1


class logging_levels(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class LoggingLevelRequest(BaseModel):
    level: logging_levels
