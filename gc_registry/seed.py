import datetime
from typing import Any, Hashable

import pandas as pd

from gc_registry.account.models import Account
from gc_registry.authentication.services import get_password_hash
from gc_registry.certificate.models import GranularCertificateBundle, IssuanceMetaData
from gc_registry.certificate.services import issue_certificates_in_date_range
from gc_registry.core.database import cqrs, db, events
from gc_registry.core.models.base import UserRoles
from gc_registry.device.meter_data.elexon.elexon import ElexonClient
from gc_registry.device.models import Device
from gc_registry.logging_config import logger
from gc_registry.user.models import User, UserAccountLink


def seed_data():
    _ = db.get_db_name_to_client()
    write_session = db.get_write_session()
    read_session = db.get_read_session()
    esdb_client = events.get_esdb_client()

    logger.info("Seeding the WRITE database with data....")

    bmu_ids = [
        "E_MARK-1",
        "T_RATS-1",
        "T_RATS-2",
        "T_RATS-3",
        "T_RATS-4",
        "T_RATSGT-2",
        "T_RATSGT-4",
    ]

    client = ElexonClient()
    from_datetime = datetime.datetime(2024, 1, 1, 0, 0, 0)
    to_datetime = from_datetime + datetime.timedelta(days=1)

    device_capacities = client.get_device_capacities(bmu_ids)

    # Create an inital Admin user
    admin_user_dict = {
        "primary_contact": "admin_user@usermail.com",
        "name": "Admin",
        "hashed_password": get_password_hash("admin"),
        "role": UserRoles.ADMIN,
    }
    admin_user = User.create(admin_user_dict, write_session, read_session, esdb_client)[
        0
    ]

    production_user_dict = {
        "primary_contact": "production_user@usermail.com",
        "name": "Production",
        "hashed_password": get_password_hash("production"),
        "role": UserRoles.PRODUCTION_USER,
    }
    production_user = User.create(
        production_user_dict, write_session, read_session, esdb_client
    )[0]

    trading_user_dict = {
        "primary_contact": "trading_user@usermail.conm",
        "name": "Trading",
        "hashed_password": get_password_hash("trading"),
        "role": UserRoles.TRADING_USER,
    }
    trading_user = User.create(
        trading_user_dict, write_session, read_session, esdb_client
    )[0]

    # Create an Account to add the certificates to
    account_dict = {
        "account_name": "Test Account",
        "user_ids": [admin_user.id, production_user.id, trading_user.id],
    }
    account = Account.create(account_dict, write_session, read_session, esdb_client)[0]

    for user in [admin_user, production_user, trading_user]:
        user_account_link_dict = {"user_id": user.id, "account_id": account.id}

        _ = UserAccountLink.create(
            user_account_link_dict, write_session, read_session, esdb_client
        )

    # Create issuance metadata for the certificates
    issuance_metadata_dict = {
        "country_of_issuance": "UK",
        "connected_grid_identification": "NESO",
        "issuing_body": "OFGEM",
        "legal_status": "legal",
        "issuance_purpose": "compliance",
        "support_received": None,
        "quality_scheme_reference": None,
        "dissemination_level": None,
        "issue_market_zone": "NESO",
    }

    issuance_metadata = IssuanceMetaData.create(
        issuance_metadata_dict, write_session, read_session, esdb_client
    )[0]

    for bmu_id in bmu_ids:
        device_dict = {
            "device_name": bmu_id,
            "local_device_identifier": bmu_id,
            "grid": "National Grid",
            "energy_source": "wind",
            "technology_type": "wind",
            "operational_date": str(datetime.datetime(2015, 1, 1, 0, 0, 0)),
            "capacity": device_capacities[bmu_id],
            "peak_demand": 100,
            "location": "Some Location",
            "account_id": account.id,
            "is_storage": False,
        }
        device = Device.create(device_dict, write_session, read_session, esdb_client)[0]

        # Use Elexon to get data from the Elexon API
        data = client.get_metering_by_device_in_datetime_range(
            from_datetime, to_datetime, local_device_identifier=bmu_id
        )
        if len(data) == 0:
            logger.info(f"No data found for {bmu_id}")
            continue

        certificate_bundles = client.map_metering_to_certificates(
            data,
            account_id=account.id,
            device=device,
            is_storage=False,
            issuance_metadata_id=issuance_metadata.id,
        )

        if not certificate_bundles:
            logger.info(f"No certificate bundles found for {bmu_id}")
        else:
            _ = cqrs.write_to_database(
                [
                    GranularCertificateBundle.model_validate(cert)
                    for cert in certificate_bundles
                ],
                write_session,
                read_session,
                esdb_client,
            )

    logger.info("Seeding complete!")

    write_session.close()
    read_session.close()

    return


def create_device_account_and_user(
    device_name, write_session, read_session, esdb_client
):
    """Create a default device, account and user for the device"""

    user_dict = {
        "primary_contact": "a_user@usermail.com",
        "name": f"Default user for {device_name}",
        "hashed_password": get_password_hash("password"),
        "role": UserRoles.PRODUCTION_USER,
    }
    user = User.create(user_dict, write_session, read_session, esdb_client)[0]

    account_dict = {
        "account_name": f"Default account for {device_name}",
        "user_ids": [user.id],
    }
    account = Account.create(account_dict, write_session, read_session, esdb_client)[0]

    user_account_link_dict: dict[Hashable, int] = {
        "user_id": user.id,
        "account_id": account.id,
    }

    _ = UserAccountLink.create(
        user_account_link_dict, write_session, read_session, esdb_client
    )

    return account, user


def seed_all_generators_from_elexon(
    from_date: datetime.date = datetime.date(2020, 1, 1),
):
    client = ElexonClient()

    _ = db.get_db_name_to_client()
    write_session = db.get_write_session()
    read_session = db.get_read_session()
    esdb_client = events.get_esdb_client()

    # Get a list of generators from the DB
    db_devices: list[Any] = Device.all(read_session)
    elexon_device_ids = [d.local_device_identifier for d in db_devices]

    # Create year long ranges from the from_date to the to_date
    data_list: list[dict[str, Any]] = []
    now = datetime.datetime.now()
    for from_datetime in pd.date_range(from_date, now.date(), freq="Y"):
        year_period_end = from_datetime + datetime.timedelta(days=365)
        to_datetime = year_period_end if year_period_end < now else now

        data = client.get_asset_dataset_in_datetime_range(
            dataset="IGCPU",
            from_date=from_datetime,
            to_date=to_datetime,
        )
        data_list.extend(data["data"])

    df = pd.DataFrame(data_list)

    df.sort_values("effectiveFrom", inplace=True, ascending=True)
    df.drop_duplicates(subset=["registeredResourceName"], inplace=True, keep="last")
    df = df[df.bmUnit.notna()]
    df["installedCapacity"] = df["installedCapacity"].astype(int)

    # drop bmUnit that are in the db
    df = df[~df.bmUnit.isin(elexon_device_ids)]

    if df.shape[0] == 0:
        logger.info("No new generators to seed")
        return

    # drop all non-renewable psr types
    df = df[df.psrType.isin(client.renewable_psr_types)]

    WATTS_IN_MEGAWATT = 1e6

    for bmu_dict in df.to_dict(orient="records"):
        account, _ = create_device_account_and_user(
            bmu_dict["registeredResourceName"], write_session, read_session, esdb_client
        )

        device_dict = {
            "device_name": bmu_dict["registeredResourceName"],
            "local_device_identifier": bmu_dict["bmUnit"],
            "grid": "National Grid",
            "energy_source": client.psr_type_to_energy_source.get(
                bmu_dict["psrType"], "other"
            ),
            "technology_type": bmu_dict["psrType"],
            "operational_date": str(datetime.datetime(2015, 1, 1, 0, 0, 0)),
            "capacity": bmu_dict["installedCapacity"] * WATTS_IN_MEGAWATT,
            "location": "Some Location",
            "account_id": account.id,
            "is_storage": False,
            "peak_demand": -bmu_dict["installedCapacity"] * 0.01,
        }
        _ = Device.create(device_dict, write_session, read_session, esdb_client)[0]  # type: ignore


def seed_certificates_for_all_devices_in_date_range(
    from_date: datetime.datetime, to_date: datetime.datetime
) -> None:
    """
    Seed the database with all generators data from the given source
    Args:
        client: The client to use to get the data
        from_datetime: The start datetime to get the data from
        to_datetime: The end datetime to get the data to
    """

    _ = db.get_db_name_to_client()
    write_session = db.get_write_session()
    read_session = db.get_read_session()
    esdb_client = events.get_esdb_client()

    client = ElexonClient()

    # Create issuance metadata for the certificates
    issuance_metadata_dict: dict[Hashable, Any] = {
        "country_of_issuance": "UK",
        "connected_grid_identification": "NESO",
        "issuing_body": "OFGEM",
        "legal_status": "legal",
        "issuance_purpose": "compliance",
        "support_received": None,
        "quality_scheme_reference": None,
        "dissemination_level": None,
        "issue_market_zone": "NESO",
    }

    issuance_metadata_list = IssuanceMetaData.create(
        issuance_metadata_dict,
        write_session,
        read_session,
        esdb_client,
    )

    if not issuance_metadata_list:
        raise ValueError("Could not create issuance metadata")

    issuance_metadata = issuance_metadata_list[0]

    issue_certificates_in_date_range(
        from_date,
        to_date,
        write_session,
        read_session,
        esdb_client,
        issuance_metadata.id,  # type: ignore
        client,  # type: ignore
    )


def seed_all_generators_and_certificates_from_elexon(
    from_datetime: datetime.datetime | None = None,
    to_datetime: datetime.datetime | None = None,
):
    seed_all_generators_from_elexon()

    if not to_datetime or not from_datetime:
        to_datetime = datetime.datetime.now() - datetime.timedelta(days=7)
        from_datetime = to_datetime - datetime.timedelta(days=1)

    seed_certificates_for_all_devices_in_date_range(from_datetime, to_datetime)
