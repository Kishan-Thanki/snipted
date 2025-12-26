from app.models.models import Snippet, User
from app.core.security import verify_password, get_password_hash

def test_password_hashing():
    """
    Test that hashing works and we can verify it.
    No database needed here.
    """
    password = "secret_password"
    hashed = get_password_hash(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_snippet_model_logic():
    """
    Test the 'like_count' property on the Snippet model.
    We mock the relationship using simple lists.
    """
    u1 = User(username="u1", email="u1@test.com", hashed_password="x")
    u2 = User(username="u2", email="u2@test.com", hashed_password="x")
    
    snippet = Snippet(title="Test", code_content="x")
    snippet.liked_by_users = [u1, u2] 
    
    assert snippet.like_count == 2