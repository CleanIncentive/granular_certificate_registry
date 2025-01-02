from datetime import datetime, timedelta

from esdbclient import EventStoreDBClient
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from gc_registry.authentication.models import TokenRecords
from gc_registry.authentication.schemas import Token
from gc_registry.authentication.services import (
    authenticate_user,
    create_access_token,
)
from gc_registry.core.database import db, events
from gc_registry.settings import settings as st

# router initialisation

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    user = authenticate_user(form_data.username, form_data.password, read_session)
    access_token_expires = timedelta(minutes=st.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.name}, expires_delta=access_token_expires
    )

    # save username and token to database to match future requests
    token_record = TokenRecords(
        username=user.name,
        token=access_token,
        expires=datetime.now() + access_token_expires,
    )
    TokenRecords.create(token_record, write_session, read_session, esdb_client)

    return {"access_token": access_token, "token_type": "bearer"}
