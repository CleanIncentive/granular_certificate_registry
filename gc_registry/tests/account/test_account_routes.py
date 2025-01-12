from gc_registry.account.models import Account
from gc_registry.account.schemas import AccountWhitelist
from gc_registry.certificate.models import GranularCertificateBundle
from gc_registry.device.models import Device
from gc_registry.user.models import User


class TestAccountRoutes:
    def test_update_whitelist(
        self,
        api_client,
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
        updated_whitelist_accounts_from_db = api_client.get(
            f"account/{fake_db_account.id}/whitelist",
            headers={"Authorization": f"Bearer {token}"},
        )
        updated_whitelist_account_ids_from_db = [
            account["id"] for account in updated_whitelist_accounts_from_db.json()
        ]
        assert (
            updated_whitelist_account_ids_from_db == [fake_db_account_2.id]
        ), f"Expected {[fake_db_account_2.id]} but got {updated_whitelist_account_ids_from_db}"

        # Test revoking access from the account
        updated_whitelist = AccountWhitelist(
            remove_from_whitelist=[fake_db_account_2.id]  # type: ignore
        )

        _updated_whitelist_response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )

        updated_whitelist_accounts_from_db = api_client.get(
            f"account/{fake_db_account.id}/whitelist",
            headers={"Authorization": f"Bearer {token}"},
        )
        updated_whitelist_account_ids_from_db = [
            account["id"] for account in updated_whitelist_accounts_from_db.json()
        ]

        assert (
            updated_whitelist_account_ids_from_db == []
        ), f"Expected '[]' but got {updated_whitelist_account_ids_from_db}"

        # Test adding an account that does not exist
        updated_whitelist = AccountWhitelist(add_to_whitelist=[999])  # type: ignore

        _updated_whitelist_response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )

        assert _updated_whitelist_response.status_code == 404
        assert _updated_whitelist_response.json() == {
            "detail": "Account ID to add not found: 999"
        }

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
        api_client,
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

        assert response.json()[0]["device_name"] == "fake_wind_device"
        assert response.json()[0]["local_device_identifier"] == "BMU-XYZ"

        # Test getting all devices by account ID that does not exist
        response = api_client.get(
            "/account/999/devices",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "No devices found for account"

    def test_get_account_summary(
        self,
        api_client,
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
        api_client,
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

    def test_get_whitelist_inverse(
        self,
        api_client,
        fake_db_account: Account,
        fake_db_account_2: Account,
        token: str,
    ):
        # Add fake_db_account_2 to fake_db_account's whitelist
        updated_whitelist = AccountWhitelist(add_to_whitelist=[fake_db_account_2.id])  # type: ignore

        _updated_whitelist_response = api_client.patch(
            f"account/update_whitelist/{fake_db_account.id}",
            content=updated_whitelist.model_dump_json(),
            headers={"Authorization": f"Bearer {token}"},
        )

        # Get the whitelist inverse from the perspective of fake_db_account_2
        response = api_client.get(
            f"account/{fake_db_account_2.id}/whitelist_inverse",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        assert response.json()[0]["id"] == fake_db_account.id
