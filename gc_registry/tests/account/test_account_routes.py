from gc_registry.account.models import Account
from gc_registry.account.schemas import AccountWhitelist


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
        updated_whitelist_from_db = api_client.get(
            f"account/{fake_db_account.id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        updated_whitelist_from_db = Account(**updated_whitelist_from_db.json())

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

        updated_whitelist_from_db = api_client.get(
            f"account/{fake_db_account.id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        updated_whitelist_from_db = Account(**updated_whitelist_from_db.json())

        assert (
            updated_whitelist_from_db.account_whitelist == []
        ), f"Expected '[]' but got {updated_whitelist_from_db.account_whitelist}"

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


    def test_get_all_devices_by_account_id(self,
        api_client,
        fake_db_account: Account,
        fake_db_device: Account,
        token: str,
    ):
        
        # Test getting all devices by account ID
        devices = api_client.get(
            f"/account/{fake_db_account.id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert devices.status_code == 200
        assert devices.json() == []

        # Test getting all devices by account ID that does not exist
        devices = api_client.get(
            f"device/account/999",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert devices.status_code == 404
        assert devices.json() == {"detail": "Account not found"}
