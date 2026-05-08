def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "email": "newuser@test.com",
        "password": "password123",
        "full_name": "New User",
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "newuser@test.com"
    assert data["user"]["full_name"] == "New User"


def test_register_duplicate_email(client, test_user):
    response = client.post("/api/auth/register", json={
        "email": "test@test.com",
        "password": "password123",
    })
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


def test_login_success(client, test_user):
    response = client.post("/api/auth/login", data={
        "username": "test@test.com",
        "password": "password123",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@test.com"


def test_login_wrong_password(client, test_user):
    response = client.post("/api/auth/login", data={
        "username": "test@test.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 401


def test_me_with_token(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@test.com"
    assert data["full_name"] == "Test User"


def test_me_without_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
