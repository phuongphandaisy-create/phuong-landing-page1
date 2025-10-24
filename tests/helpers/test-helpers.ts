import { Page, expect } from '@playwright/test'

/**
 * Test Logger - Utility for logging test steps
 */
export class TestLogger {
    constructor(private page: Page, private testName: string) { }

    async logStep(description: string, action: () => Promise<void>) {
        console.log(`🔍 [${this.testName}] ${description}`)
        await action()
        console.log(`✅ [${this.testName}] ${description} - Completed`)
    }

    async logSuccess(message: string) {
        console.log(`🎉 [${this.testName}] ${message}`)
    }

    async logError(message: string, error?: any) {
        console.error(`❌ [${this.testName}] ${message}`, error)
    }
}

/**
 * Authentication Helper - Utilities for auth testing
 */
export class AuthHelper {
    constructor(private page: Page, private logger: TestLogger) { }

    async login(username: string = 'admin', password: string = 'admin123') {
        await this.logger.logStep('Opening login modal', async () => {
            await this.page.click('[data-testid="login-button"]')
            await expect(this.page.locator('[data-testid="login-modal"]')).toBeVisible()
        })

        await this.logger.logStep('Filling login credentials', async () => {
            await this.page.fill('[data-testid="username-input"]', username)
            await this.page.fill('[data-testid="password-input"]', password)
        })

        await this.logger.logStep('Submitting login form', async () => {
            await this.page.click('[data-testid="submit-login"]')
        })

        await this.logger.logStep('Waiting for login success', async () => {
            await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 })
        })
    }

    async logout() {
        await this.logger.logStep('Logging out', async () => {
            await this.page.click('[data-testid="logout-button"]')
            await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible()
        })
    }

    async expectLoggedIn() {
        await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible()
    }

    async expectLoggedOut() {
        await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible()
    }
}

/**
 * Form Helper - Utilities for form testing
 */
export class FormHelper {
    constructor(private page: Page, private logger: TestLogger) { }

    async fillContactForm(data: {
        name: string
        email: string
        message: string
    }) {
        await this.logger.logStep('Filling contact form', async () => {
            await this.page.fill('[data-testid="contact-name-input"]', data.name)
            await this.page.fill('[data-testid="contact-email-input"]', data.email)
            await this.page.fill('[data-testid="contact-message-input"]', data.message)
        })
    }

    async submitContactForm() {
        await this.logger.logStep('Submitting contact form', async () => {
            await this.page.click('[data-testid="submit-contact-form"]')
        })
    }

    async expectContactFormSuccess() {
        await expect(this.page.locator('[data-testid="contact-success-message"]')).toBeVisible()
    }

    async expectFormError(field: string, errorMessage?: string) {
        const errorLocator = this.page.locator(`[data-testid="${field}-error"]`)
        await expect(errorLocator).toBeVisible()
        if (errorMessage) {
            await expect(errorLocator).toContainText(errorMessage)
        }
    }
}

/**
 * Blog Helper - Utilities for blog testing
 */
export class BlogHelper {
    constructor(private page: Page, private logger: TestLogger) { }

    async createBlogPost(data: {
        title: string
        excerpt: string
        content: string
    }) {
        await this.logger.logStep('Navigating to admin blog page', async () => {
            await this.page.goto('/admin/blog')
        })

        await this.logger.logStep('Opening blog editor', async () => {
            await this.page.click('[data-testid="create-blog-post"]')
        })

        await this.logger.logStep('Filling blog post data', async () => {
            await this.page.fill('[data-testid="blog-title-input"]', data.title)
            await this.page.fill('[data-testid="blog-excerpt-input"]', data.excerpt)
            await this.page.fill('[data-testid="blog-content-input"]', data.content)
        })

        await this.logger.logStep('Saving blog post', async () => {
            await this.page.click('[data-testid="save-blog-post"]')
        })
    }

    async expectBlogPostExists(title: string) {
        await expect(this.page.locator(`text=${title}`)).toBeVisible()
    }

    async deleteBlogPost(title: string) {
        await this.logger.logStep(`Deleting blog post: ${title}`, async () => {
            const postCard = this.page.locator(`[data-testid="blog-card"]:has-text("${title}")`)
            await postCard.locator('[data-testid="delete-blog-post"]').click()

            // Confirm deletion
            await this.page.locator('[data-testid="confirm-delete"]').click()
        })
    }
}

/**
 * Navigation Helper - Utilities for navigation testing
 */
export class NavigationHelper {
    constructor(private page: Page, private logger: TestLogger) { }

    async navigateToPage(pageName: string, url: string) {
        await this.logger.logStep(`Navigating to ${pageName}`, async () => {
            await this.page.goto(url)
            await waitForPageLoad(this.page)
        })
    }

    async clickNavLink(linkText: string) {
        await this.logger.logStep(`Clicking navigation link: ${linkText}`, async () => {
            await this.page.click(`nav a:has-text("${linkText}")`)
            await waitForPageLoad(this.page)
        })
    }

    async expectCurrentUrl(expectedUrl: string) {
        await expect(this.page).toHaveURL(expectedUrl)
    }
}

/**
 * Environment Configuration
 */
export function getEnvironmentConfig() {
    const env = process.env.NODE_ENV || 'test'
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

    return {
        env,
        baseUrl,
        isCI: !!process.env.CI,
        isDev: env === 'development',
        isTest: env === 'test',
    }
}

/**
 * Wait for page to load completely
 */
export async function waitForPageLoad(page: Page, timeout: number = 30000) {
    await page.waitForLoadState('networkidle', { timeout })
    await page.waitForLoadState('domcontentloaded', { timeout })
}

/**
 * Wait for element to be visible with retry
 */
export async function waitForElement(
    page: Page,
    selector: string,
    options: { timeout?: number; retries?: number } = {}
) {
    const { timeout = 10000, retries = 3 } = options

    for (let i = 0; i < retries; i++) {
        try {
            await page.waitForSelector(selector, { timeout, state: 'visible' })
            return
        } catch (error) {
            if (i === retries - 1) throw error
            await page.waitForTimeout(1000) // Wait 1 second before retry
        }
    }
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${name}-${timestamp}.png`
    await page.screenshot({ path: `test-results/screenshots/${filename}`, fullPage: true })
    console.log(`📸 Screenshot saved: ${filename}`)
}

/**
 * Mock API responses
 */
export class ApiMocker {
    constructor(private page: Page) { }

    async mockContactSubmission(success: boolean = true) {
        await this.page.route('/api/contact', async (route) => {
            if (success) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        data: { id: '1', message: 'Contact form submitted successfully' }
                    })
                })
            } else {
                await route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: false,
                        error: { message: 'Internal server error', code: 'INTERNAL_ERROR' }
                    })
                })
            }
        })
    }

    async mockBlogPosts(posts: any[] = []) {
        await this.page.route('/api/blog', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: posts
                })
            })
        })
    }

    async mockAuthSuccess() {
        await this.page.route('/api/auth/**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: { id: '1', username: 'admin' },
                    expires: '2024-12-31'
                })
            })
        })
    }
}

/**
 * Database Helper for integration tests
 */
export class DatabaseHelper {
    static async cleanupTestData() {
        // This would typically clean up test data from database
        // Implementation depends on your database setup
        console.log('🧹 Cleaning up test data...')
    }

    static async seedTestData() {
        // This would typically seed test data
        console.log('🌱 Seeding test data...')
    }
}

/**
 * Performance Helper
 */
export class PerformanceHelper {
    constructor(private page: Page) { }

    async measurePageLoad(url: string) {
        const startTime = Date.now()
        await this.page.goto(url)
        await waitForPageLoad(this.page)
        const endTime = Date.now()

        const loadTime = endTime - startTime
        console.log(`⏱️ Page load time for ${url}: ${loadTime}ms`)

        return loadTime
    }

    async expectPageLoadTime(url: string, maxTime: number) {
        const loadTime = await this.measurePageLoad(url)
        expect(loadTime).toBeLessThan(maxTime)
    }
}