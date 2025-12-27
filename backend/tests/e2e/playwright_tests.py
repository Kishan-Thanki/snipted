from playwright.sync_api import sync_playwright

def test_full_user_journey():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto("http://localhost:3000/register")
        page.fill("input[type='email']", "playwright@test.com")
        page.fill("input[placeholder='Username']", "playwright_user")
        page.fill("input[type='password']", "secure_password_123")
        page.click("button[type='submit']")

        page.wait_for_url("**/") 
        
        page.click("text=Create Snippet")
        page.fill("input[name='title']", "Playwright Test Snippet")
        page.fill("textarea", "print('hello world')")
        page.click("button:has-text('Save')")

        page.wait_for_selector("text=Playwright Test Snippet")
        
        page.click("text=Logout")
        assert page.is_visible("text=Log In")

        browser.close()