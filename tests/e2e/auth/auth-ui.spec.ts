import { test, expect } from '@playwright/test';

test.describe('Authentication UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for page to fully load - login button should appear after session check
    await page.waitForTimeout(2000);
  });

  test('Should show login button when not authenticated', async ({ page }) => {
    // Wait for login button to appear (it may take time for session to load)
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
  });

  test('Should open login modal when login button is clicked', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible();
  });

  test('Should show validation errors for empty form', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('[data-testid="submit-login"]');
    
    // Check that validation errors appear
    await expect(page.locator('[data-testid="username-input-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input-error"]')).toBeVisible();
  });

  test('Should close modal when cancel is clicked', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible();
    
    await page.click('[data-testid="close-modal"]');
    await expect(page.locator('[data-testid="login-modal"]')).not.toBeVisible();
  });

  test('Should show error message for invalid credentials', async ({ page }) => {
    // Mock failed authentication
    await page.route('/api/auth/signin/credentials', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid username or password' })
      });
    });

    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="username-input"]', 'wronguser');
    await page.fill('[data-testid="password-input"]', 'wrongpass');
    await page.click('[data-testid="submit-login"]');

    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid username or password');
  });

  test('Should show user menu when authenticated', async ({ page }) => {
    // Mock authenticated session
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          user: { id: '1', username: 'admin' },
          expires: '2024-12-31'
        })
      });
    });

    await page.reload();
    
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toContainText('admin');
    await expect(page.locator('[data-testid="login-button"]')).not.toBeVisible();
  });
});