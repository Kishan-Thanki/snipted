import uuid
from fastapi.testclient import TestClient

def test_search_functionality(client: TestClient, normal_user_token_headers):
    run_id = str(uuid.uuid4())[:8]
    
    target_title = f"Advanced Sorting {run_id}"
    client.post("/api/v1/snippets/", json={
        "title": target_title, 
        "code_content": "def bubble_sort(): pass", 
        "tags": ["algo"]
    })
    
    target_code_marker = f"React_{run_id}"
    client.post("/api/v1/snippets/", json={
        "title": "Frontend UI", 
        "code_content": f"import {target_code_marker} from 'react';", 
        "tags": ["ui"]
    })
    
    client.post("/api/v1/snippets/", json={
        "title": "Go Routine", 
        "code_content": "go func()", 
        "tags": ["concurrency"]
    })

    res_title = client.get(f"/api/v1/snippets/?q={target_title}")
    assert res_title.status_code == 200
    data_title = res_title.json()
    assert len(data_title) == 1
    assert data_title[0]["title"] == target_title

    res_code = client.get(f"/api/v1/snippets/?q={target_code_marker}")
    assert res_code.status_code == 200
    data_code = res_code.json()
    assert len(data_code) == 1
    assert target_code_marker in data_code[0]["code_content"]
    
    res_combined = client.get(f"/api/v1/snippets/?q={target_title}&tag=ui")
    assert len(res_combined.json()) == 0

def test_pagination_max_limit(client: TestClient):
    """Ensure the API rejects limit > 100"""
    response = client.get("/api/v1/snippets/?limit=150")
    assert response.status_code == 422