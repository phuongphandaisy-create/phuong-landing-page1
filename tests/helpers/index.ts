/**
 * Test Helpers Index
 * 
 * This file exports all test helper utilities for easy importing
 */

// Main test helpers
export * from './test-helpers'

// Mock data and scenarios
export * from './mock-data'

// Setup utilities
export * from './playwright-helpers'
export * from './jest-helpers'

// Custom matchers
export * from './custom-matchers'

// Re-export commonly used testing utilities
export { render, screen, waitFor, fireEvent, act } from '@/shared/test-utils'
export { expect } from '@playwright/test'

// Import expect for use in TestPatterns
import { expect } from '@playwright/test'

/**
 * Quick access to commonly used test utilities
 */
export const TestUtils = {
  // Test data generators
  generateBlogPost: (overrides = {}) => {
    const { TestDataGenerator } = require('./mock-data')
    return TestDataGenerator.generateBlogPost(overrides)
  },
  
  generateContactSubmission: (overrides = {}) => {
    const { TestDataGenerator } = require('./mock-data')
    return TestDataGenerator.generateContactSubmission(overrides)
  },
  
  generateUser: (overrides = {}) => {
    const { TestDataGenerator } = require('./mock-data')
    return TestDataGenerator.generateUser(overrides)
  },
  
  // Quick setup methods
  setupMocks: () => {
    const { MockSetup } = require('./jest-helpers')
    MockSetup.setupGlobalMocks()
    MockSetup.setupNextJsMocks()
    MockSetup.setupAuthMocks()
  },
  
  resetMocks: () => {
    const { MockSetup } = require('./jest-helpers')
    MockSetup.resetAllMocks()
  },
  
  // Environment helpers
  getTestEnv: () => {
    const { EnvironmentSetup } = require('./playwright-helpers')
    return EnvironmentSetup.getTestEnvironment()
  },
}

/**
 * Test constants
 */
export const TEST_CONSTANTS = {
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
  },
  
  VIEWPORTS: {
    MOBILE: { width: 375, height: 667, name: 'Mobile' },
    TABLET: { width: 768, height: 1024, name: 'Tablet' },
    DESKTOP: { width: 1280, height: 720, name: 'Desktop' },
    LARGE_DESKTOP: { width: 1920, height: 1080, name: 'Large Desktop' },
  },
  
  TEST_IDS: {
    // Auth
    LOGIN_BUTTON: 'login-button',
    LOGIN_MODAL: 'login-modal',
    USERNAME_INPUT: 'username-input',
    PASSWORD_INPUT: 'password-input',
    SUBMIT_LOGIN: 'submit-login',
    USER_MENU: 'user-menu',
    LOGOUT_BUTTON: 'logout-button',
    
    // Contact Form
    CONTACT_FORM: 'contact-form',
    CONTACT_NAME_INPUT: 'contact-name-input',
    CONTACT_EMAIL_INPUT: 'contact-email-input',
    CONTACT_MESSAGE_INPUT: 'contact-message-input',
    SUBMIT_CONTACT_FORM: 'submit-contact-form',
    CONTACT_SUCCESS_MESSAGE: 'contact-success-message',
    
    // Blog
    BLOG_CARD: 'blog-card',
    CREATE_BLOG_POST: 'create-blog-post',
    BLOG_TITLE_INPUT: 'blog-title-input',
    BLOG_EXCERPT_INPUT: 'blog-excerpt-input',
    BLOG_CONTENT_INPUT: 'blog-content-input',
    SAVE_BLOG_POST: 'save-blog-post',
    DELETE_BLOG_POST: 'delete-blog-post',
    
    // Navigation
    NAV_HOME: 'nav-home',
    NAV_ABOUT: 'nav-about',
    NAV_BLOG: 'nav-blog',
    NAV_CONTACT: 'nav-contact',
    NAV_ADMIN: 'nav-admin',
  },
  
  API_ENDPOINTS: {
    CONTACT: '/api/contact',
    BLOG: '/api/blog',
    AUTH: '/api/auth',
  },
  
  ROUTES: {
    HOME: '/',
    ABOUT: '/about',
    BLOG: '/blog',
    CONTACT: '/contact',
    ADMIN: '/admin',
    LOGIN: '/login',
  },
}

/**
 * Common test patterns
 */
export const TestPatterns = {
  // Form validation pattern
  async testFormValidation(page: any, formSelector: string, testCases: Array<{
    input: Record<string, string>
    expectedErrors: string[]
  }>) {
    for (const testCase of testCases) {
      // Fill form with test data
      for (const [field, value] of Object.entries(testCase.input)) {
        // Map field names to actual data-testid values
        let fieldSelector = field
        if (formSelector.includes('contact-form')) {
          const fieldMapping: Record<string, string> = {
            'name': 'contact-name-input',
            'email': 'contact-email-input', 
            'message': 'contact-message-input'
          }
          fieldSelector = fieldMapping[field] || field
        }
        await page.fill(`${formSelector} [data-testid="${fieldSelector}"]`, value)
      }
      
      // Submit form
      await page.click(`${formSelector} [type="submit"]`)
      
      // Check for expected errors
      for (const error of testCase.expectedErrors) {
        await expect(page.locator(`text=${error}`)).toBeVisible()
      }
    }
  },
  
  // Navigation pattern
  async testNavigation(page: any, routes: Array<{ path: string; expectedTitle: string }>) {
    for (const route of routes) {
      await page.goto(route.path)
      await expect(page).toHaveTitle(new RegExp(route.expectedTitle, 'i'))
    }
  },
  
  // Responsive design pattern
  async testResponsiveDesign(page: any, viewports: Array<{ width: number; height: number; name: string }>) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.waitForTimeout(500)
      
      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      
      expect(hasHorizontalScroll).toBe(false)
    }
  },
  
  // Performance pattern
  async testPagePerformance(page: any, url: string, maxLoadTime: number) {
    const startTime = Date.now()
    await page.goto(url)
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(maxLoadTime)
    return loadTime
  },
}