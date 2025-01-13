from fastapi.testclient import TestClient

from gc_registry.account.models import Account
from gc_registry.account.schemas import AccountWhitelist
from gc_registry.certificate.models import GranularCertificateBundle
from gc_registry.device.models import Device
from gc_registry.user.models import User


class TestAccountRoutes:
    def test_update_whitelist(
        self,
        api_client: TestClient,
        fake_db_account: Account,
        fake_db_account_2: Account,
        token: str,
    ):
        """Test that the whitelist can be updated in the database via their FastAPI routes."""

        # Test adding to account
        updated_whitelist = AccountWhitelist(add_to_whitelist=[fake_db_account_2.id])  # type: ignore

        _updated_whitelist_response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )
        response = api_client.get(
            f"account/{fake_db_account.id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        updated_whitelist_from_db = Account(**response.json())

        assert (
            updated_whitelist_from_db.account_whitelist == [fake_db_account_2.id]
        ), f"Expected {[fake_db_account_2.id]} but got {updated_whitelist_from_db.account_whitelist}"

        # Test revoking access from the account
        updated_whitelist = AccountWhitelist(
            remove_from_whitelist=[fake_db_account_2.id]  # type: ignore
        )

        _updated_whitelist_response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )

        response = api_client.get(
            f"account/{fake_db_account.id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        updated_whitelist_from_db = Account(**response.json())

        assert (
            updated_whitelist_from_db.account_whitelist == []
        ), f"Expected '[]' but got {updated_whitelist_from_db.account_whitelist}"

        # Test adding an account that does not exist
        updated_whitelist = AccountWhitelist(add_to_whitelist=[999])  # type: ignore

        response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 404
        assert response.json() == {"detail": "Account ID to add not found: 999"}

        # Test adding an account to its own whitelist
        updated_whitelist = AccountWhitelist(add_to_whitelist=[fake_db_account.id])  # type: ignore

        _updated_whitelist_response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )

        assert _updated_whitelist_response.status_code == 400
        assert _updated_whitelist_response.json() == {
            "detail": "Cannot add an account to its own whitelist."
        }

    def test_get_all_devices_by_account_id(
        self,
        api_client: TestClient,
        fake_db_account: Account,
        fake_db_wind_device: Device,
        fake_db_solar_device: Device,
        token: str,
    ):
        # Test getting all devices by account ID
        response = api_client.get(
            f"/account/{fake_db_account.id}/devices",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200

        print(response.json())

        # get wind device from response
        wind_device = next(
            (device for device in response.json() if device["energy_source"] == "wind"),
            None,
        )
        assert wind_device is not None
        assert wind_device["device_name"] == "fake_wind_device"
        assert wind_device["local_device_identifier"] == "BMU-XYZ"

        # Test getting all devices by account ID that does not exist
        response = api_client.get(
            "/account/999/devices",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "No devices found for account"

    def test_get_account_summary(
        self,
        api_client: TestClient,
        fake_db_account: Account,
        fake_db_wind_device: Device,
        fake_db_solar_device: Device,
        fake_db_granular_certificate_bundle: GranularCertificateBundle,
        token: str,
    ):
        # Test getting all devices by account ID
        response = api_client.get(
            f"/account/{fake_db_account.id}/summary",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        assert response.json()["energy_by_fuel_type"] == {"wind": 1000}

        # Test getting all devices by account ID that does not exist
        fake_id = 1234
        response = api_client.get(
            f"/account/{fake_id}/summary",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 404
        assert response.json()["detail"] == f"Account with id {fake_id} not found"

    def test_get_users_by_account_id(
        self,
        api_client: TestClient,
        fake_db_account: Account,
        fake_db_user: User,
        token: str,
    ):
        # Test getting all devices by account ID
        response = api_client.get(
            f"/account/{fake_db_account.id}/users",
            headers={"Authorization": f"Bearer {token}"},
        )
        print(response.json())
        assert response.status_code == 200
        assert response.json()[0]["primary_contact"] == "jake_fake@fakecorp.com"


def test_list_all_account_bundles(
    api_client: TestClient,
    token: str,
    fake_db_granular_certificate_bundle: GranularCertificateBundle,
    fake_db_granular_certificate_bundle_2: GranularCertificateBundle,
    fake_db_user: User,
    fake_db_account: Account,
):
    # Test case 1: Try to query a certificate with correct parameters
    response = api_client.get(
        f"/account/{fake_db_account.id}/certificates",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert len(response.json()["granular_certificate_bundles"]) == 2

    # Now test with a limit
    response = api_client.get(
        f"/account/{fake_db_account.id}/certificates?limit=1",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert len(response.json()["granular_certificate_bundles"]) == 1
