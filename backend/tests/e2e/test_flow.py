import uuid
from fastapi.testclient import TestClient

def test_full_user_journey(client: TestClient):
    unique_email = f"journey_{uuid.uuid4().hex[:8]}@test.com"
    
    reg_res = client.post("/api/v1/auth/register", json={
        "email": unique_email, 
        "username": f"user_{uuid.uuid4().hex[:8]}", 
        "password": "secure_long_password" 
    })
    assert reg_res.status_code == 201

    csrf_token = reg_res.cookies.get("csrf_token")
    assert csrf_token

    post_res = client.post("/api/v1/snippets/", json={
        "title": "My Journey",
        "code_content": "go()",
        "tags": ["travel", "python"]
    }, headers={"X-CSRF-Token": csrf_token})
    assert post_res.status_code == 201
    snippet_id = post_res.json()["id"]

    search_res = client.get("/api/v1/snippets/?q=journey")
    data = search_res.json()
    assert len(data) >= 1

    like_res = client.post(f"/api/v1/snippets/{snippet_id}/like", headers={"X-CSRF-Token": csrf_token})
    assert like_res.json()["is_liked"] is True

    client.post("/api/v1/auth/logout")

    del_res = client.delete(f"/api/v1/snippets/{snippet_id}", headers={"X-CSRF-Token": csrf_token})
    assert del_res.status_code == 401
