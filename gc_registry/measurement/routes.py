# Imports
from esdbclient import EventStoreDBClient
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from gc_registry.authentication.services import get_current_user
from gc_registry.core.database import db, events
from gc_registry.core.models.base import UserRoles
from gc_registry.device.models import Device
from gc_registry.measurement import models
from gc_registry.measurement.services import parse_measurement_json
from gc_registry.user.models import User
from gc_registry.user.validation import validate_user_access, validate_user_role

# Router initialisation
router = APIRouter(tags=["Measurements"])

### Device Meter Readings ###


@router.post("/submit_readings", response_model=models.MeasurementSubmissionResponse)
def submit_readings(
    measurement_json: str,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    """Submit meter readings as a JSON-serialised CSV file for a single device,
    creating a MeasurementReport for each production interval against which GC
    Bundles can be issued. Returns a summary of the readings submitted.

    Args:
        measurement_json (str): A JSON-serialised CSV file containing the meter readings.

    Returns:
        models.MeasurementSubmissionResponse: A summary of the readings submitted.
    """
    validate_user_role(current_user, required_role=UserRoles.PRODUCTION_USER)

    measurement_df = parse_measurement_json(measurement_json, to_df=True)

    # Check that the device ID is associated with an account that the user has access to
    device_id = measurement_df["device_id"].unique()
    device = Device.by_id(device_id, read_session)
    validate_user_access(current_user, device.account_id, read_session)

    readings = models.MeasurementReport.create(
        measurement_df.to_dict(orient="records"),
        write_session,
        read_session,
        esdb_client,
    )

    if not readings:
        raise HTTPException(
            status_code=500, detail="Could not create measurement reports."
        )

    measurement_response = models.MeasurementSubmissionResponse(
        message="Readings submitted successfully.",
        total_device_usage=measurement_df["interval_usage"].sum().astype(int),
        first_reading_datetime=measurement_df["interval_start_datetime"].min(),
        last_reading_datetime=measurement_df["interval_start_datetime"].max(),
    )

    return measurement_response


@router.post("/create", response_model=models.MeasurementReportRead)
def create_measurement(
    measurement_base: models.MeasurementReportBase,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    validate_user_role(current_user, required_role=UserRoles.PRODUCTION_USER)

    device = Device.by_id(measurement_base.device_id, read_session)
    validate_user_access(current_user, device.account_id, read_session)

    measurement = models.MeasurementReport.create(
        measurement_base, write_session, read_session, esdb_client
    )

    return measurement


@router.get("/{measurement_id}", response_model=models.MeasurementReportRead)
def read_measurement(
    measurement_id: int,
    current_user: User = Depends(get_current_user),
    read_session: Session = Depends(db.get_read_session),
):
    validate_user_role(current_user, required_role=UserRoles.AUDIT_USER)

    measurement = models.MeasurementReport.by_id(measurement_id, read_session)

    return measurement


@router.patch("/update/{measurement_id}", response_model=models.MeasurementReportRead)
def update_measurement(
    measurement_id: int,
    measurement_update: models.MeasurementReportUpdate,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    # Measurement updates are only allowed for Admin users as GCs may have been issued against them
    validate_user_role(current_user, required_role=UserRoles.ADMIN)

    measurement = models.MeasurementReport.by_id(measurement_id, read_session)

    return measurement.update(
        measurement_update, write_session, read_session, esdb_client
    )


@router.delete("/delete/{id}", response_model=models.MeasurementReportRead)
def delete_measurement(
    measurement_id: int,
    current_user: User = Depends(get_current_user),
    write_session: Session = Depends(db.get_write_session),
    read_session: Session = Depends(db.get_read_session),
    esdb_client: EventStoreDBClient = Depends(events.get_esdb_client),
):
    # Measurement deletions are only allowed for Admin users as GCs may have been issued against them
    validate_user_role(current_user, required_role=UserRoles.ADMIN)

    db_measurement = models.MeasurementReport.by_id(measurement_id, write_session)

    return db_measurement.delete(write_session, read_session, esdb_client)
