import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('Should navigate to all main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/AI-Assisted Landing Page/);
    
    // About page
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('AI Landing');
    
    // Blog page
    await page.click('nav a[href="/blog"]');
    await expect(page).toHaveURL('/blog');
    
    // Contact page
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Get In Touch');
    
    // Back to home
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('Should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu should be visible
    await expect(page.locator('button[aria-label="Toggle mobile menu"]')).toBeVisible();
    
    // Click mobile menu
    await page.click('button[aria-label="Toggle mobile menu"]');
    
    // Mobile menu items should be visible (look for mobile-specific menu items)
    await expect(page.locator('.md\\:hidden a[href="/"]')).toBeVisible();
    await expect(page.locator('.md\\:hidden a[href="/about"]')).toBeVisible();
    await expect(page.locator('.md\\:hidden a[href="/blog"]')).toBeVisible();
    await expect(page.locator('.md\\:hidden a[href="/contact"]')).toBeVisible();
  });

  test('Should have proper SEO elements', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toBeTruthy();
    
    // Check H1
    const h1 = await page.locator('h1').first().textContent();
    expect(h1).toBeTruthy();
  });

  test('Should not have horizontal scroll on different viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 720, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForTimeout(500);
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});