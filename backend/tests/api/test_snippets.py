from fastapi.testclient import TestClient

def test_create_snippet(client: TestClient, normal_user_token_headers):
    data = {
        "title": "Pytest Snippet",
        "code_content": "assert True",
        "language": "python",
        "tags": ["testing", "qa"]
    }

    response = client.post(
        "/api/v1/snippets/", 
        headers=normal_user_token_headers, 
        json=data
    )
    assert response.status_code == 201
    content = response.json()
    assert content["title"] == "Pytest Snippet"
    assert len(content["tags"]) == 2

def test_read_snippets_filter(client: TestClient, normal_user_token_headers):
    client.post("/api/v1/snippets/", json={"title": "A", "code_content": "x", "tags": ["python"]})
    client.post("/api/v1/snippets/", json={"title": "B", "code_content": "x", "tags": ["javascript"]})

    response = client.get("/api/v1/snippets/?tag=python")
    assert response.status_code == 200
    data = response.json()
    assert any(s["title"] == "A" for s in data)

def test_update_snippet_owner(client: TestClient, normal_user_token_headers):
    create_res = client.post(
        "/api/v1/snippets/", 
        json={"title": "Old", "code_content": "x"}
    )
    snippet_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/snippets/{snippet_id}",
        json={"title": "New Title", "code_content": "x", "language": "text"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "New Title"

def test_delete_snippet_permission(client: TestClient):
    """Ensure anonymous users cannot delete snippets"""
    client.cookies.clear()
    
    response = client.delete("/api/v1/snippets/1")
    assert response.status_code == 401