import uuid
from locust import HttpUser, task, between

class SnippetSpammer(HttpUser):
    wait_time = between(0.5, 2)
    
    def on_start(self):
        unique_id = str(uuid.uuid4())[:8]
        self.client.post("/api/v1/auth/register", json={
            "email": f"locust_{unique_id}@test.com",
            "username": f"bot_{unique_id}",
            "password": "strong_password_123" 
        })

    @task(3)
    def view_feed(self):
        """
        Normal behavior: Reading snippets.
        Should always return 200 OK.
        """
        self.client.get("/api/v1/snippets/")

    @task(1)
    def try_to_spam(self):
        """
        Spam behavior: Posting snippets.
        Should trigger 429 Too Many Requests after 5 posts.
        """
        with self.client.post("/api/v1/snippets/", json={
            "title": "Locust Load Test",
            "code_content": "while True: print('spam')",
            "language": "python",
            "tags": ["spam"]
        }, catch_response=True) as response:
            
            if response.status_code == 201:
                response.success() 
            elif response.status_code == 429:
                response.success() 
            else:
                response.failure(f"Unexpected error: {response.status_code}")