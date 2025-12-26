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
    
    post_res = client.post("/api/v1/snippets/", json={
        "title": "My Journey", "code_content": "go()", "tags": ["travel", "python"]
    })
    assert post_res.status_code == 201
    snippet_id = post_res.json()["id"]

    search_res = client.get("/api/v1/snippets/?q=journey")
    data = search_res.json()
    assert len(data) >= 1
    
    like_res = client.post(f"/api/v1/snippets/{snippet_id}/like")
    assert like_res.json()["is_liked"] is True

    client.post("/api/v1/auth/logout")

    del_res = client.delete(f"/api/v1/snippets/{snippet_id}")
    assert del_res.status_code == 401