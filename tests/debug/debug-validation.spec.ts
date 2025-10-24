import { test, expect } from '@playwright/test';

test.describe('Debug Validation', () => {
  test('Debug - Check contact form validation behavior', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="contact-form"]', { timeout: 10000 });
    
    console.log('=== BEFORE SUBMIT ===');
    
    // Check initial state
    const nameInput = page.locator('[data-testid="contact-name-input"]');
    const emailInput = page.locator('[data-testid="contact-email-input"]');
    const messageInput = page.locator('[data-testid="contact-message-input"]');
    const submitButton = page.locator('[data-testid="submit-contact-form"]');
    
    console.log('Name input value:', await nameInput.inputValue());
    console.log('Email input value:', await emailInput.inputValue());
    console.log('Message input value:', await messageInput.inputValue());
    
    // Submit empty form
    await submitButton.click();
    
    // Wait a bit for validation to trigger
    await page.waitForTimeout(1000);
    
    console.log('=== AFTER SUBMIT ===');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-validation.png', fullPage: true });
    
    // Check if any error elements exist
    const allErrors = await page.locator('[data-testid*="error"]').all();
    console.log(`Found ${allErrors.length} error elements`);
    
    for (let i = 0; i < allErrors.length; i++) {
      const error = allErrors[i];
      const testId = await error.getAttribute('data-testid');
      const text = await error.textContent();
      const isVisible = await error.isVisible();
      console.log(`Error ${i}: data-testid="${testId}", text="${text}", visible=${isVisible}`);
    }
    
    // Check form state after submit
    console.log('Name input value after submit:', await nameInput.inputValue());
    console.log('Email input value after submit:', await emailInput.inputValue());
    console.log('Message input value after submit:', await messageInput.inputValue());
    
    // Check if form has any validation classes
    const form = page.locator('[data-testid="contact-form"]');
    const formClasses = await form.getAttribute('class');
    console.log('Form classes:', formClasses);
    
    // Check input classes
    const nameClasses = await nameInput.getAttribute('class');
    const emailClasses = await emailInput.getAttribute('class');
    const messageClasses = await messageInput.getAttribute('class');
    
    console.log('Name input classes:', nameClasses);
    console.log('Email input classes:', emailClasses);
    console.log('Message input classes:', messageClasses);
  });

  test('Debug - Test manual validation trigger', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="contact-form"]', { timeout: 10000 });
    
    // Fill invalid email
    await page.fill('[data-testid="contact-name-input"]', 'Test Name');
    await page.fill('[data-testid="contact-email-input"]', 'invalid-email');
    await page.fill('[data-testid="contact-message-input"]', 'Test message');
    
    // Submit form
    await page.click('[data-testid="submit-contact-form"]');
    
    // Wait for validation
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-invalid-email.png', fullPage: true });
    
    // Check for any error messages
    const allText = await page.textContent('body');
    console.log('Page contains "valid email":', allText?.includes('valid email'));
    console.log('Page contains "required":', allText?.includes('required'));
    console.log('Page contains "error":', allText?.includes('error'));
  });
});