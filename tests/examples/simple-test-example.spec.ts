import { test, expect } from '@playwright/test'
import { TestLogger, mockFormData } from '../helpers'

test.describe('Simple Test Example', () => {
  test('Basic navigation test', async ({ page }) => {
    const logger = new TestLogger(page, 'Simple Test')
    
    await logger.logStep('Navigate to homepage', async () => {
      await page.goto('/')
      await expect(page).toHaveTitle(/AI-Assisted Landing Page/)
    })
    
    await logger.logStep('Check navigation links', async () => {
      await expect(page.locator('nav a[href="/"]')).toBeVisible()
      await expect(page.locator('nav a[href="/about"]')).toBeVisible()
      await expect(page.locator('nav a[href="/blog"]')).toBeVisible()
      await expect(page.locator('nav a[href="/contact"]')).toBeVisible()
    })
    
    await logger.logSuccess('Navigation test completed successfully')
  })
  
  test('Contact page basic test', async ({ page }) => {
    const logger = new TestLogger(page, 'Contact Test')
    
    await logger.logStep('Navigate to contact page', async () => {
      await page.goto('/contact')
      await expect(page).toHaveTitle(/AI-Assisted Landing Page/)
    })
    
    await logger.logStep('Check contact form exists', async () => {
      await expect(page.locator('form')).toBeVisible()
      await expect(page.locator('input[type="text"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('textarea')).toBeVisible()
    })
    
    await logger.logSuccess('Contact page test completed')
  })
  
  test('Test with mock data', async ({ page }) => {
    const logger = new TestLogger(page, 'Mock Data Test')
    
    await logger.logStep('Using mock data for testing', async () => {
      // Test that mock data is available
      expect(mockFormData.validContact.name).toBe('John Doe')
      expect(mockFormData.validContact.email).toBe('john@example.com')
      expect(mockFormData.validContact.message).toContain('valid test message')
    })
    
    await logger.logSuccess('Mock data test completed')
  })
})