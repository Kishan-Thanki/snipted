import uuid
import pytest
from app.main import app
from typing import Generator, Dict
from app.core.limiter import limiter  
from app.db.session import SessionLocal
from fastapi.testclient import TestClient

@pytest.fixture(scope="session", autouse=True)
def disable_rate_limiting():
    limiter.enabled = False
    yield
    limiter.enabled = True

@pytest.fixture(scope="session")
def db() -> Generator:
    """
    Creates a fresh database session for testing.
    """
    yield SessionLocal()

@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient) -> Dict[str, str]:
    """
    1. Registers a unique user.
    2. Logs in (Server sets Cookie).
    3. Returns the Auth Header (Derived from Cookie) for compatibility.
    """
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "testpassword"

    response = client.post(
        "/api/v1/auth/register",
        json={"email": unique_email, "username": unique_email, "password": password},
    )
    assert response.status_code == 201

    token = response.cookies.get("access_token")
    if not token:
        pytest.fail("No cookie found in registration response")

    return {"Authorization": f"Bearer {token}"}