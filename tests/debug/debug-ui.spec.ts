import { test, expect } from '@playwright/test';

test.describe('Debug UI Elements', () => {
  test('Debug - Check what elements exist on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    
    // Log all buttons on the page
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on the page`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const testId = await button.getAttribute('data-testid');
      console.log(`Button ${i}: text="${text}", data-testid="${testId}"`);
    }
    
    // Log all links with data-testid
    const linksWithTestId = await page.locator('[data-testid]').all();
    console.log(`Found ${linksWithTestId.length} elements with data-testid`);
    
    for (let i = 0; i < linksWithTestId.length; i++) {
      const element = linksWithTestId[i];
      const testId = await element.getAttribute('data-testid');
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      console.log(`Element ${i}: ${tagName}, data-testid="${testId}", text="${text}"`);
    }
    
    // Check if header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('Debug - Check contact form elements', async ({ page }) => {
    await page.goto('/contact');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-contact.png', fullPage: true });
    
    // Check form exists
    const form = page.locator('[data-testid="contact-form"]');
    await expect(form).toBeVisible();
    
    // Log all form inputs
    const inputs = await page.locator('input, textarea').all();
    console.log(`Found ${inputs.length} form inputs`);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const testId = await input.getAttribute('data-testid');
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');
      console.log(`Input ${i}: data-testid="${testId}", type="${type}", placeholder="${placeholder}"`);
    }
  });
});