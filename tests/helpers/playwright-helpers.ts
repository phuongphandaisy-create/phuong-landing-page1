import { Page, Browser, BrowserContext } from '@playwright/test'
import { TestLogger, DatabaseHelper } from './test-helpers'

/**
 * Global test setup utilities for Playwright
 */
export class TestSetup {
  static async beforeAll() {
    console.log('🚀 Starting test suite...')
    await DatabaseHelper.cleanupTestData()
    await DatabaseHelper.seedTestData()
  }

  static async afterAll() {
    console.log('🏁 Test suite completed')
    await DatabaseHelper.cleanupTestData()
  }

  static async beforeEach(page: Page, testName: string) {
    const logger = new TestLogger(page, testName)
    
    // Set up page defaults
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Set up console logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`🔴 Browser Console Error: ${msg.text()}`)
      }
    })
    
    // Set up error handling
    page.on('pageerror', (error) => {
      console.error(`🔴 Page Error: ${error.message}`)
    })
    
    return logger
  }

  static async afterEach(page: Page, testName: string) {
    // Clean up any test-specific data
    try {
      await page.evaluate(() => {
        // Clear localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.clear()
        }
        // Clear sessionStorage
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear()
        }
      })
    } catch (error) {
      // Ignore localStorage access errors in test environment
      console.log('Note: Could not clear storage (this is normal in some test environments)')
    }
  }
}

/**
 * Browser setup utilities
 */
export class BrowserSetup {
  static async setupContext(browser: Browser, options: {
    viewport?: { width: number; height: number }
    permissions?: string[]
    locale?: string
  } = {}): Promise<BrowserContext> {
    const {
      viewport = { width: 1280, height: 720 },
      permissions = [],
      locale = 'en-US'
    } = options

    const context = await browser.newContext({
      viewport,
      permissions,
      locale,
      // Record video for failed tests
      recordVideo: {
        dir: 'test-results/videos/',
        size: viewport
      }
    })

    return context
  }

  static async setupPage(context: BrowserContext, options: {
    baseURL?: string
    timeout?: number
  } = {}): Promise<Page> {
    const {
      baseURL = 'http://localhost:3000',
      timeout = 30000
    } = options

    const page = await context.newPage()
    
    // Set default timeout
    page.setDefaultTimeout(timeout)
    page.setDefaultNavigationTimeout(timeout)
    
    // Set base URL
    if (baseURL) {
      await page.goto(baseURL)
    }

    return page
  }
}

/**
 * Environment setup utilities
 */
export class EnvironmentSetup {
  static getTestEnvironment() {
    return {
      NODE_ENV: process.env.NODE_ENV || 'test',
      BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
      CI: process.env.CI === 'true',
      HEADLESS: process.env.HEADLESS !== 'false',
      SLOW_MO: parseInt(process.env.SLOW_MO || '0'),
      TIMEOUT: parseInt(process.env.TIMEOUT || '30000'),
    }
  }

  static async setupTestDatabase() {
    // This would set up a test database
    // Implementation depends on your database setup
    console.log('🗄️ Setting up test database...')
  }

  static async teardownTestDatabase() {
    // This would clean up the test database
    console.log('🗄️ Tearing down test database...')
  }
}

/**
 * Performance setup utilities
 */
export class PerformanceSetup {
  static async setupPerformanceMonitoring(page: Page) {
    // Set up performance monitoring
    await page.addInitScript(() => {
      // Monitor performance
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        console.log('Performance metrics:', {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          totalTime: perfData.loadEventEnd - perfData.fetchStart,
        })
      })
    })
  }

  static async measurePageMetrics(page: Page) {
    return await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      }
    })
  }
}

/**
 * Accessibility setup utilities
 */
export class AccessibilitySetup {
  static async setupAccessibilityTesting(page: Page) {
    // Inject axe-core for accessibility testing
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
    })
  }

  static async runAccessibilityAudit(page: Page) {
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run((err: any, results: any) => {
          if (err) throw err
          resolve(results)
        })
      })
    })
    
    return results
  }
}

/**
 * Visual regression setup utilities
 */
export class VisualSetup {
  static async setupVisualTesting(page: Page) {
    // Set up consistent visual testing environment
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    })
  }

  static async takeVisualSnapshot(page: Page, name: string, options: {
    fullPage?: boolean
    clip?: { x: number; y: number; width: number; height: number }
  } = {}) {
    const { fullPage = true, clip } = options
    
    return await page.screenshot({
      path: `test-results/visual/${name}.png`,
      fullPage,
      clip,
    })
  }
}