from esdbclient import EventStoreDBClient
from fastapi import APIRouter, Depends
from sqlmodel import Session

from gc_registry.authentication.services import get_current_user
from gc_registry.core.database import db, events
from gc_registry.core.models.base import UserRoles
from gc_registry.user import models
from gc_registry.user.validation import validate_user_role

# Router initialisation
router = APIRouter(tags=["Users"])

### User ###


@router.post("/create", response_model=models.UserRead)
def create_user(
    user_base: models.UserBase,
    headers: dict = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    user = models.User.create(user_base, write_session, read_session, esdb_client)

    return user


@router.get("/{user_id}", response_model=models.UserRead)
def read_user(
    user_id: int,
    headers: dict = Depends(get_current_user),
    read_session: Session = Depends(db.get_read_session),
):
    user = models.User.by_id(user_id, read_session)

    return user


@router.patch("/update/{user_id}", response_model=models.UserRead)
def update_user(
    user_id: int,
    user_update: models.UserUpdate,
    headers: dict = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    user = models.User.by_id(user_id, write_session)

    return user.update(user_update, write_session, read_session, esdb_client)


@router.delete("/delete/{id}", response_model=models.UserRead)
def delete_user(
    user_id: int,
    headers: dict = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    user = models.User.by_id(user_id, read_session)
    return user.delete(write_session, read_session, esdb_client)


@router.post("/change_role/{user_id}", response_model=models.UserRead)
def change_role(
    user_id: int,
    role: UserRoles,
    headers: dict = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    user = models.User.by_id(user_id, write_session)
    return user.update(role, write_session, read_session, esdb_client)
