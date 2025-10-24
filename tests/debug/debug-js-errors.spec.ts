import { test, expect } from '@playwright/test';

test.describe('Debug JavaScript Errors', () => {
  test('Debug - Check for JavaScript errors during form submission', async ({ page }) => {
    const jsErrors: string[] = [];
    const consoleMessages: string[] = [];
    
    // Listen for JavaScript errors
    page.on('pageerror', (error) => {
      jsErrors.push(`Page Error: ${error.message}`);
      console.log('🔴 Page Error:', error.message);
    });
    
    // Listen for console messages
    page.on('console', (msg) => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      if (msg.type() === 'error') {
        console.log('🔴 Console Error:', msg.text());
      } else if (msg.type() === 'log') {
        console.log('📝 Console Log:', msg.text());
      }
    });
    
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="contact-form"]', { timeout: 10000 });
    
    console.log('=== SUBMITTING EMPTY FORM ===');
    
    // Submit empty form
    await page.click('[data-testid="submit-contact-form"]');
    
    // Wait for any async operations
    await page.waitForTimeout(2000);
    
    console.log('=== RESULTS ===');
    console.log(`JavaScript Errors: ${jsErrors.length}`);
    jsErrors.forEach((error, i) => console.log(`  ${i + 1}. ${error}`));
    
    console.log(`Console Messages: ${consoleMessages.length}`);
    consoleMessages.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
    
    // Check if form validation state changed
    const form = page.locator('[data-testid="contact-form"]');
    const formHTML = await form.innerHTML();
    
    console.log('Form contains error classes:', formHTML.includes('border-red'));
    console.log('Form contains error text:', formHTML.includes('required'));
    
    // Try to trigger validation manually by evaluating JavaScript
    const validationResult = await page.evaluate(() => {
      const form = document.querySelector('[data-testid="contact-form"]') as HTMLFormElement;
      if (form) {
        // Try to trigger form validation
        const isValid = form.checkValidity();
        return {
          isValid,
          validationMessage: form.validationMessage,
          hasRequiredFields: form.querySelectorAll('[required]').length
        };
      }
      return null;
    });
    
    console.log('HTML5 Validation Result:', validationResult);
  });
});