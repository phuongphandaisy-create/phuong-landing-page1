import { test, expect } from '@playwright/test';

test.describe('Contact Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Wait for the contact form to be visible
    await page.waitForSelector('[data-testid="contact-form"]', { timeout: 10000 });
  });

  test('Should display contact form', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-message-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-contact-form"]')).toBeVisible();
  });

  test('Should show validation errors for empty form', async ({ page }) => {
    await page.click('[data-testid="submit-contact-form"]');
    
    // Wait for validation errors to appear
    await expect(page.locator('[data-testid="contact-name-input-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-email-input-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-message-input-error"]')).toBeVisible();
  });

  test('Should show email validation error for invalid email', async ({ page }) => {
    await page.fill('[data-testid="contact-name-input"]', 'John Doe');
    await page.fill('[data-testid="contact-email-input"]', 'invalid-email');
    await page.fill('[data-testid="contact-message-input"]', 'This is a test message');
    
    await page.click('[data-testid="submit-contact-form"]');
    
    await expect(page.locator('[data-testid="contact-email-input-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-email-input-error"]')).toContainText('valid email');
  });

  test('Should show success message on successful submission', async ({ page }) => {
    // Mock successful API response
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: '1', message: 'Contact form submitted successfully' }
        })
      });
    });

    await page.fill('[data-testid="contact-name-input"]', 'John Doe');
    await page.fill('[data-testid="contact-email-input"]', 'john@example.com');
    await page.fill('[data-testid="contact-message-input"]', 'This is a test message that is long enough to pass validation');
    
    await page.click('[data-testid="submit-contact-form"]');
    
    await expect(page.locator('[data-testid="contact-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-success-message"]')).toContainText('Thank you for your message');
  });

  test('Should show error message on API failure', async ({ page }) => {
    // Mock failed API response
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { message: 'Internal server error' }
        })
      });
    });

    await page.fill('[data-testid="contact-name-input"]', 'John Doe');
    await page.fill('[data-testid="contact-email-input"]', 'john@example.com');
    await page.fill('[data-testid="contact-message-input"]', 'This is a test message that is long enough to pass validation');
    
    await page.click('[data-testid="submit-contact-form"]');
    
    await expect(page.locator('text=Sorry, there was an error sending your message. Please try again.')).toBeVisible();
  });

  test('Should clear form after successful submission', async ({ page }) => {
    // Mock successful API response
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: '1', message: 'Contact form submitted successfully' }
        })
      });
    });

    await page.fill('[data-testid="contact-name-input"]', 'John Doe');
    await page.fill('[data-testid="contact-email-input"]', 'john@example.com');
    await page.fill('[data-testid="contact-message-input"]', 'This is a test message that is long enough to pass validation');
    
    await page.click('[data-testid="submit-contact-form"]');
    
    // Wait for success message
    await expect(page.locator('[data-testid="contact-success-message"]')).toBeVisible();
    
    // Check that form is cleared
    await expect(page.locator('[data-testid="contact-name-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="contact-email-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="contact-message-input"]')).toHaveValue('');
  });
});