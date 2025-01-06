import json

import pytest
from fastapi.testclient import TestClient

from gc_registry.device.models import Device


@pytest.fixture
def valid_measurement_json(fake_db_solar_device: Device):
    return json.dumps(
        [
            {
                "device_id": fake_db_solar_device.id,
                "interval_usage": 10,
                "interval_start_datetime": "2024-11-18T10:00:00",
                "interval_end_datetime": "2024-11-18T11:00:00",
                "gross_net_indicator": "NET",
            },
            {
                "device_id": fake_db_solar_device.id,
                "interval_usage": 15,
                "interval_start_datetime": "2024-11-18T11:00:00",
                "interval_end_datetime": "2024-11-18T12:00:00",
                "gross_net_indicator": "NET",
            },
            {
                "device_id": fake_db_solar_device.id,
                "interval_usage": 20,
                "interval_start_datetime": "2024-11-18T12:00:00",
                "interval_end_datetime": "2024-11-18T13:00:00",
                "gross_net_indicator": "NET",
            },
        ]
    )


def test_submit_readings_success(
    api_client: TestClient,
    token: str,
    valid_measurement_json: str,
):
    """Test successful submission of readings."""

    response = api_client.post(
        "measurement/submit_readings",
        params={"measurement_json": valid_measurement_json},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    response_data = response.json()
    assert response_data["message"] == "Readings submitted successfully."
    assert response_data["total_device_usage"] == 45
    assert response_data["first_reading_datetime"] == "2024-11-18T10:00:00"
    assert response_data["last_reading_datetime"] == "2024-11-18T12:00:00"
