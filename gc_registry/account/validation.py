from fastapi import HTTPException
from sqlalchemy import func
from sqlmodel import Session, select

from gc_registry.account.models import Account
from gc_registry.account.schemas import AccountBase, AccountWhitelist
from gc_registry.user.models import User


def validate_account(account: Account | AccountBase, read_session: Session):
    """Validates account creation and update requests."""

    # Account names must be unique and case insensitive
    account_exists = read_session.exec(
        select(Account).filter(
            func.lower(Account.account_name) == func.lower(account.account_name)
        )
    ).first()

    if account_exists is not None:
        raise HTTPException(
            status_code=400, detail="Account name already exists in the database."
        )

    # All user_ids linked to the account must exist in the database
    if account.user_ids is not None:
        user_ids_in_db = read_session.exec(
            select(User.id).filter(User.id.in_(account.user_ids))  # type: ignore
        ).all()
        user_ids_in_db_set = {user_id for (user_id,) in user_ids_in_db}
        if user_ids_in_db_set != set(account.user_ids):
            raise HTTPException(
                status_code=400,
                detail="One or more users assigned to this account do not exist in the database.",
            )


def validate_account_whitelist_update(
    account: Account, account_whitelist_update: AccountWhitelist, read_session: Session
):
    """Ensure that the account whitelist update is valid by checking that the accounts in question exist.

    Args:
        account (Account): The account to be updated.
        account_whitelist_update (AccountWhitelist): The whitelist update to be applied.
        read_session (Session): The database session to read from.

    Returns:
        modified_whitelist: The modified whitelist to be applied to the account.
    """
    existing_whitelist = (
        [] if account.account_whitelist is None else account.account_whitelist
    )

    if account_whitelist_update.add_to_whitelist is not None:
        for account_id_to_add in account_whitelist_update.add_to_whitelist:
            if account_id_to_add == account.id:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot add an account to its own whitelist.",
                )
            if not Account.exists(account_id_to_add, read_session):
                raise HTTPException(
                    status_code=404,
                    detail=f"Account ID to add not found: {account_id_to_add}",
                )
        modified_whitelist = list(
            set(existing_whitelist + account_whitelist_update.add_to_whitelist)  # type: ignore
        )

    if account_whitelist_update.remove_from_whitelist is not None:
        modified_whitelist = list(
            set(existing_whitelist)
            - set(account_whitelist_update.remove_from_whitelist)  # type: ignore
        )

    return modified_whitelist
