from fastapi.testclient import TestClient

def test_create_user(client: TestClient):
    response = client.post(
        "/api/v1/users/",
        json={"email": "new@example.com", "username": "newuser", "password": "password123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "id" in data
    assert "password" not in data  

def test_create_user_duplicate_email(client: TestClient):
    # 1. Create first user
    client.post(
        "/api/v1/users/",
        json={"email": "dup@example.com", "username": "u1", "password": "p1"},
    )
    # 2. Try creating same email again
    response = client.post(
        "/api/v1/users/",
        json={"email": "dup@example.com", "username": "u2", "password": "p2"},
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_read_users_me(client: TestClient, normal_user_token_headers):
    # Test the Protected Endpoint using the token fixture
    response = client.get("/api/v1/users/me", headers=normal_user_token_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"