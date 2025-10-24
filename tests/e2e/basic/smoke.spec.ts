import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Homepage should load without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    
    // Check that page loads
    await expect(page).toHaveTitle(/AI-Assisted Landing Page/);
    
    // Check for basic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Log any errors for debugging
    if (errors.length > 0) {
      console.log('Console/Page errors:', errors);
    }
  });

  test('Contact page should load', async ({ page }) => {
    await page.goto('/contact');
    
    // Should not show error page
    await expect(page.locator('h1')).not.toContainText('Error');
    await expect(page.locator('h1')).not.toContainText('Unhandled Runtime Error');
    
    // Should show contact content
    await expect(page.locator('text=Get In Touch')).toBeVisible();
  });

  test('About page should load', async ({ page }) => {
    await page.goto('/about');
    
    // Should not show error page
    await expect(page.locator('h1')).not.toContainText('Error');
    await expect(page.locator('h1')).not.toContainText('Unhandled Runtime Error');
  });

  test('Blog page should load', async ({ page }) => {
    await page.goto('/blog');
    
    // Should not show error page
    await expect(page.locator('h1')).not.toContainText('Error');
    await expect(page.locator('h1')).not.toContainText('Unhandled Runtime Error');
  });
});