import { test, expect } from '@playwright/test'
import { 
  TestLogger, 
  AuthHelper, 
  FormHelper, 
  BlogHelper,
  NavigationHelper,
  ApiMocker,
  TestSetup,
  mockFormData,
  testScenarios,
  TEST_CONSTANTS,
  TestPatterns
} from '../helpers'

test.describe('Complete Test Example', () => {
  let logger: TestLogger
  let authHelper: AuthHelper
  let formHelper: FormHelper
  let blogHelper: BlogHelper
  let navHelper: NavigationHelper
  let apiMocker: ApiMocker

  test.beforeEach(async ({ page }) => {
    logger = await TestSetup.beforeEach(page, 'Complete Test Example')
    authHelper = new AuthHelper(page, logger)
    formHelper = new FormHelper(page, logger)
    blogHelper = new BlogHelper(page, logger)
    navHelper = new NavigationHelper(page, logger)
    apiMocker = new ApiMocker(page)
  })

  test.afterEach(async ({ page }) => {
    await TestSetup.afterEach(page, 'Complete Test Example')
  })

  test('Complete user workflow - Contact form submission', async ({ page }) => {
    // Navigate to contact page
    await navHelper.navigateToPage('Contact', '/contact')
    
    // Test form validation with multiple scenarios
    await TestPatterns.testFormValidation(page, '[data-testid="contact-form"]', [
      {
        input: testScenarios.contactForm.emptyFields.input,
        expectedErrors: testScenarios.contactForm.emptyFields.expectedErrors
      },
      {
        input: testScenarios.contactForm.invalidEmail.input,
        expectedErrors: [testScenarios.contactForm.invalidEmail.expectedError]
      }
    ])

    // Test successful submission
    await logger.logStep('Testing successful contact form submission', async () => {
      await formHelper.fillContactForm(mockFormData.validContact)
      await formHelper.submitContactForm()
      await formHelper.expectContactFormSuccess()
    })

    // Test page performance
    const loadTime = await TestPatterns.testPagePerformance(page, '/contact', 3000)
    logger.logSuccess(`Contact page loaded in ${loadTime}ms`)
  })

  test('Complete admin workflow - Blog management', async ({ page }) => {
    // Login as admin
    await authHelper.login()
    
    // Navigate to admin area
    await navHelper.navigateToPage('Admin', '/admin')
    
    // Create a blog post
    await blogHelper.createBlogPost(mockFormData.validBlogPost)
    await blogHelper.expectBlogPostExists(mockFormData.validBlogPost.title)
    
    // Test blog post is visible on public blog page
    await navHelper.navigateToPage('Blog', '/blog')
    await blogHelper.expectBlogPostExists(mockFormData.validBlogPost.title)
    
    // Clean up - delete the blog post
    await navHelper.navigateToPage('Admin', '/admin/blog')
    await blogHelper.deleteBlogPost(mockFormData.validBlogPost.title)
    
    // Logout
    await authHelper.logout()
  })

  test('Responsive design across viewports', async ({ page }) => {
    await TestPatterns.testResponsiveDesign(page, [
      TEST_CONSTANTS.VIEWPORTS.MOBILE,
      TEST_CONSTANTS.VIEWPORTS.TABLET,
      TEST_CONSTANTS.VIEWPORTS.DESKTOP
    ])
  })

  test('Navigation across all pages', async ({ page }) => {
    await TestPatterns.testNavigation(page, [
      { path: TEST_CONSTANTS.ROUTES.HOME, expectedTitle: 'AI-Assisted Landing Page' },
      { path: TEST_CONSTANTS.ROUTES.ABOUT, expectedTitle: 'AI-Assisted Landing Page' },
      { path: TEST_CONSTANTS.ROUTES.BLOG, expectedTitle: 'AI-Assisted Landing Page' },
      { path: TEST_CONSTANTS.ROUTES.CONTACT, expectedTitle: 'AI-Assisted Landing Page' }
    ])
  })

  test('API error handling', async ({ page }) => {
    // Mock API error
    await apiMocker.mockContactSubmission(false)
    
    // Navigate to contact page
    await page.goto('/contact')
    
    // Fill and submit form
    await formHelper.fillContactForm(mockFormData.validContact)
    await formHelper.submitContactForm()
    
    // Expect error message
    await expect(page.locator('text=Sorry, there was an error sending your message. Please try again.')).toBeVisible()
  })

  test('Accessibility compliance', async ({ page }) => {
    await page.goto('/')
    
    // Basic accessibility check - inject axe-core and run audit
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
    })
    
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        window.axe.run((err: any, results: any) => {
          if (err) throw err
          resolve(results)
        })
      })
    })
    
    // @ts-ignore
    const violations = results.violations || []
    expect(violations.length).toBe(0)
  })

  test('SEO validation', async ({ page }) => {
    await page.goto('/')
    
    // Check basic SEO elements
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
    expect(title.length).toBeLessThanOrEqual(60)
    
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content')
    expect(metaDescription).toBeTruthy()
    
    const h1 = await page.locator('h1').first().textContent()
    expect(h1).toBeTruthy()
  })

  test('Performance benchmarks', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/about', name: 'About' },
      { url: '/blog', name: 'Blog' },
      { url: '/contact', name: 'Contact' }
    ]

    for (const pageInfo of pages) {
      const loadTime = await TestPatterns.testPagePerformance(page, pageInfo.url, 3000)
      console.log(`📊 ${pageInfo.name} load time: ${loadTime}ms`)
    }
  })
})