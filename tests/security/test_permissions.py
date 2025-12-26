import uuid
from fastapi.testclient import TestClient

def test_access_snippet_without_token(client: TestClient):
    """Fail if I try to post without logging in"""
    client.cookies.clear() 
    response = client.post("/api/v1/snippets/", json={"title": "Hack", "code_content": "x"})
    assert response.status_code == 401

def test_delete_other_users_snippet(client: TestClient, normal_user_token_headers):
    res = client.post(
        "/api/v1/snippets/", 
        headers=normal_user_token_headers,
        json={"title": "User A Code", "code_content": "print(a)"}
    )
    snippet_id = res.json()["id"]

    attacker_email = f"evil_{uuid.uuid4().hex[:8]}@evil.com"
    client.post("/api/v1/auth/register", json={
        "email": attacker_email, 
        "username": attacker_email, 
        "password": "attacker_strong_password"
    })
    
    login_res = client.post("/api/v1/auth/login", data={
        "username": attacker_email, 
        "password": "attacker_strong_password"
    })
    attacker_token = login_res.cookies.get("access_token")
    
    client.cookies.clear() 
    client.cookies.set("access_token", attacker_token) 
    
    delete_res = client.delete(f"/api/v1/snippets/{snippet_id}")
    
    assert delete_res.status_code == 403
    assert "Not enough permissions" in delete_res.json()["detail"]

def test_use_fake_token(client: TestClient):
    """Try to use a token that is completely invalid"""
    client.cookies.clear()
    tampered_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.garbage.signature"
    client.cookies.set("access_token", tampered_token)
    response = client.get("/api/v1/users/me")
    assert response.status_code == 403