class TestAuthRoutes:
    def test_login(self, api_client, fake_db_user):
        response = api_client.post(
            "/auth/login",
            data={"username": fake_db_user.name, "password": "password"},
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "bearer"
        assert response.json()["access_token"] is not None

    def test_login_fail(self, api_client, fake_db_user):
        response = api_client.post(
            "/auth/login",
            data={"username": fake_db_user.name, "password": "wrong_password"},
        )
        assert response.status_code == 401
        assert response.json() == {
            "detail": f"Password for '{fake_db_user.name}' is incorrect."
        }

        response = api_client.post(
            "/auth/login",
            data={"username": "no_user", "password": "password"},
        )
        assert response.status_code == 404
        assert response.json() == {"detail": f"User 'no_user' not found."}
