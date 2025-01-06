from esdbclient import EventStoreDBClient
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select

from gc_registry.account.models import Account, AccountBase, AccountRead
from gc_registry.account.schemas import AccountSummary, AccountUpdate, AccountWhitelist
from gc_registry.account.validation import (
    validate_account,
    validate_account_whitelist_update,
)
from gc_registry.authentication.services import get_current_user
from gc_registry.certificate.models import GranularCertificateBundle
from gc_registry.core.database import db, events
from gc_registry.core.models.base import UserRoles
from gc_registry.user.models import User
from gc_registry.user.validation import validate_user_access, validate_user_role

# Router initialisation
router = APIRouter(tags=["Accounts"])


@router.post("/create", status_code=201, response_model=AccountRead)
def create_account(
    account_base: AccountBase,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    validate_user_role(current_user, required_role=UserRoles.PRODUCTION_USER)
    validate_account(account_base, read_session)
    accounts = Account.create(account_base, write_session, read_session, esdb_client)
    if not accounts:
        raise HTTPException(status_code=500, detail="Could not create Account")

    account = accounts[0].model_dump()

    return account


@router.get("/{account_id}", response_model=AccountRead)
def read_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    read_session: Session = Depends(db.get_read_session),
):
    account = Account.by_id(account_id, read_session)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.patch("/update/{account_id}", response_model=AccountRead)
def update_account(
    account_id: int,
    account_update: AccountUpdate,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    validate_user_role(current_user, required_role=UserRoles.TRADING_USER)
    validate_user_access(current_user, account_id, read_session)

    account = Account.by_id(account_id, write_session)
    if not account:
        raise HTTPException(
            status_code=404, detail=f"Account ID not found: {account_id}"
        )

    if account.is_deleted:
        raise HTTPException(status_code=400, detail="Cannot update deleted accounts.")

    updated_account = account.update(
        account_update, write_session, read_session, esdb_client
    )

    if not updated_account:
        raise HTTPException(
            status_code=400, detail=f"Error during account update: {account_id}"
        )
    return updated_account.model_dump()


@router.patch("/update_whitelist/{account_id}", response_model=AccountRead)
def update_whitelist(
    account_id: int,
    account_whitelist_update: AccountWhitelist,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    validate_user_role(current_user, required_role=UserRoles.TRADING_USER)
    validate_user_access(current_user, account_id, read_session)

    account = Account.by_id(account_id, write_session)
    if not account:
        raise HTTPException(
            status_code=404, detail=f"Account ID not found: {account_id}"
        )

    modified_whitelist = validate_account_whitelist_update(
        account, account_whitelist_update, read_session
    )

    account_update = AccountUpdate(account_whitelist=modified_whitelist)

    updated_account = account.update(
        account_update, write_session, read_session, esdb_client
    )
    if not updated_account:
        raise HTTPException(
            status_code=400, detail=f"Error during account update: {account_id}"
        )
    return updated_account.model_dump()


@router.delete("/delete/{account_id}", status_code=200, response_model=AccountRead)
def delete_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    validate_user_role(current_user, required_role=UserRoles.TRADING_USER)
    validate_user_access(current_user, account_id, read_session)
    try:
        account = Account.by_id(account_id, write_session)
        accounts = account.delete(write_session, read_session, esdb_client)
        if not accounts:
            raise ValueError(f"Account id {account_id} not found")
        return accounts[0].model_dump()
    except Exception:
        raise HTTPException(
            status_code=404, detail="Could not delete Account not found"
        )


@router.get("/list", response_model=list[AccountRead])
def list_all_accounts(
    current_user: User = Depends(get_current_user),
    read_session: Session = Depends(db.get_read_session),
):
    """List all active accounts on the registry."""
    validate_user_role(current_user, required_role=UserRoles.TRADING_USER)
    accounts = Account.all(read_session)
    return accounts


@router.get("/{account_id}/summary", response_model=AccountSummary)
def get_account_summary(
    account_id: int,
    current_user: User = Depends(get_current_user),
    read_session: Session = Depends(db.get_read_session),
):
    """Get a summary of an account."""
    validate_user_role(current_user, required_role=UserRoles.AUDIT_USER)
    account = Account.by_id(account_id, read_session)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Retrieve summary information
    num_devices = len(account.devices) if account.devices else 0
    num_granular_certificate_bundles = read_session.exec(
        select(func.count(GranularCertificateBundle.id)).filter(
            GranularCertificateBundle.account_id == account_id
        )
    ).scalar()
    total_certificate_energy = read_session.exec(
        select(func.sum(GranularCertificateBundle.bundle_quantity)).filter(
            GranularCertificateBundle.account_id == account_id
        )
    ).scalar()

    return AccountSummary(
        id=account.id,
        account_name=account.account_name,
        num_devices=num_devices,
        num_granular_certificate_bundles=num_granular_certificate_bundles,
        total_certificate_energy=total_certificate_energy,
    )
