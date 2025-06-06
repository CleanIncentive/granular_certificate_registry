import datetime
import json
from functools import partial
from typing import Any, Hashable, Type, TypeVar

from esdbclient import EventStoreDBClient
from fastapi import HTTPException
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, select

from gc_registry.core.database import cqrs

T = TypeVar("T", bound="ActiveRecord")

utc_datetime_now = partial(datetime.datetime.now, datetime.timezone.utc)


class ActiveRecord(SQLModel):
    created_at: datetime.datetime = Field(
        default_factory=utc_datetime_now, nullable=False
    )

    @classmethod
    def by_id(
        cls: Type[T],
        id_: int,
        session: Session,
        close_session: bool = False,
    ) -> T:
        obj = session.get(cls, id_)
        if obj is None:
            raise HTTPException(
                status_code=404, detail=f"{cls.__name__} with id {id_} not found"
            )
        if close_session:
            session.close()
        return obj

    @classmethod
    def all(cls, session: Session) -> list[SQLModel]:
        return session.exec(select(cls)).all()

    @classmethod
    def exists(cls, id_: int, session: Session) -> bool:
        return session.get(cls, id_) is not None

    @classmethod
    def create(
        cls,
        source: list[dict[Hashable, Any]] | dict[Hashable, Any] | BaseModel,
        write_session: Session,
        read_session: Session,
        esdb_client: EventStoreDBClient,
    ) -> list[SQLModel] | None:
        if isinstance(source, (SQLModel, BaseModel)):
            obj = [cls.model_validate(source)]
        elif isinstance(source, dict):
            obj = [cls.model_validate_json(json.dumps(source))]
        elif isinstance(source, list):
            obj = [cls.model_validate_json(json.dumps(elem)) for elem in source]
        else:
            raise ValueError(f"The input type {type(source)} can not be processed")

        # logger.debug(f"Creating {cls.__name__}: {obj[0].model_dump_json()}")
        created_entities = cqrs.write_to_database(
            obj,  # type: ignore
            write_session,
            read_session,
            esdb_client,
        )

        return created_entities

    def update(
        self,
        update_entity: BaseModel,
        write_session: Session,
        read_session: Session,
        esdb_client: EventStoreDBClient,
    ) -> SQLModel | None:
        # logger.debug(f"Updating {self.__class__.__name__}: {self.model_dump_json()}")
        updated_entity = cqrs.update_database_entity(
            entity=self,
            update_entity=update_entity,
            write_session=write_session,
            read_session=read_session,
            esdb_client=esdb_client,
        )

        return updated_entity

    def delete(
        self,
        write_session: Session,
        read_session: Session,
        esdb_client: EventStoreDBClient,
    ) -> list[SQLModel] | None:
        # logger.debug(f"Deleting {self.__class__.__name__}: {self.model_dump_json()}")
        deleted_entities = cqrs.delete_database_entities(
            entities=self,
            write_session=write_session,
            read_session=read_session,
            esdb_client=esdb_client,
        )

        return deleted_entities
