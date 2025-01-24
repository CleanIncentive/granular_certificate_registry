from fastapi.testclient import TestClient

from gc_registry.user.models import User


class TestUserRoutes:
    def test_read_current_user(
        self, api_client: TestClient, fake_db_user: User, token: str
    ):
        res = api_client.get("/user/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        assert res.json()["name"] == fake_db_user.name
