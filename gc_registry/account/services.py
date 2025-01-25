from sqlmodel import Session, func, select
from sqlmodel.sql.expression import SelectOfScalar

from gc_registry.account.models import Account
from gc_registry.account.schemas import AccountRead
from gc_registry.certificate.models import GranularCertificateBundle
from gc_registry.user.models import UserAccountLink


def get_account_by_id(account_id: int, read_session: Session):
    stmt: SelectOfScalar = select(Account).where(Account.id == account_id)
    account = read_session.exec(stmt).first()
    return account


def get_account_summary(account: Account, read_session: Session):
    # Retrieve summary information
    num_devices = len(account.devices) if account.devices else 0
    num_granular_certificate_bundles = read_session.exec(
        select(func.count(GranularCertificateBundle.id)).where(
            GranularCertificateBundle.account_id == account.id
        )
    ).first()

    total_certificate_energy = read_session.exec(
        select(func.sum(GranularCertificateBundle.bundle_quantity)).where(
            GranularCertificateBundle.account_id == account.id
        )
    ).first()

    stmt = (  # type: ignore
        select(  # type: ignore
            GranularCertificateBundle.energy_source,
            func.sum(GranularCertificateBundle.bundle_quantity),
        )
        .where(GranularCertificateBundle.account_id == account.id)
        .group_by(GranularCertificateBundle.energy_source)
    )
    energy_by_energy_source = {r[0]: r[1] for r in read_session.exec(stmt).all()}

    account_summary = {
        "id": account.id,
        "account_name": account.account_name,
        "num_devices": num_devices,
        "num_granular_certificate_bundles": num_granular_certificate_bundles,
        "total_certificate_energy": total_certificate_energy,
        "energy_by_fuel_type": energy_by_energy_source,
    }

    return account_summary


def get_accounts_by_user_id(
    user_id: int | None, read_session: Session
) -> list[AccountRead] | None:
    """Get accounts by user ID.

    Args:
        user_id (int): The ID of the user.
        read_session (Session): The read session.

    Returns:
        list[AccountRead] | None: List of accounts or None if no accounts are found.
    """
    if not user_id:
        raise ValueError("User ID is required")

    stmt: SelectOfScalar = (
        select(Account)
        .join(UserAccountLink)
        .where(
            UserAccountLink.user_id == user_id,
            UserAccountLink.is_deleted == False,  # noqa: E712
        )
    )
    accounts = read_session.exec(stmt).all()
    if not accounts:
        return None

    account_reads = [AccountRead.model_validate(a.model_dump()) for a in accounts]

    return account_reads
