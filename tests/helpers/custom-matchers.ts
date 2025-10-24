import { expect } from '@playwright/test'

/**
 * Custom matchers for Playwright tests
 */

// Extend Playwright's expect with custom matchers
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveLoadedWithinTime(maxTime: number): R
      toBeAccessible(): R
      toHaveValidSEO(): R
      toHaveResponsiveDesign(): R
      toHaveValidForm(): R
    }
  }
}

/**
 * Check if page loaded within specified time
 */
expect.extend({
  async toHaveLoadedWithinTime(page: any, maxTime: number) {
    const startTime = Date.now()
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    const pass = loadTime <= maxTime
    
    return {
      message: () => 
        pass 
          ? `Page loaded in ${loadTime}ms (within ${maxTime}ms limit)`
          : `Page took ${loadTime}ms to load (exceeded ${maxTime}ms limit)`,
      pass,
    }
  },
})

/**
 * Check if page is accessible (basic accessibility audit)
 */
expect.extend({
  async toBeAccessible(page: any) {
    // Inject axe-core if not already present
    try {
      await page.evaluate(() => window.axe)
    } catch {
      await page.addScriptTag({
        url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
      })
    }
    
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
    const pass = violations.length === 0
    
    return {
      message: () => 
        pass 
          ? 'Page has no accessibility violations'
          : `Page has ${violations.length} accessibility violations: ${violations.map((v: any) => v.description).join(', ')}`,
      pass,
    }
  },
})

/**
 * Check if page has valid SEO elements
 */
expect.extend({
  async toHaveValidSEO(page: any) {
    const seoChecks = await page.evaluate(() => {
      const title = document.querySelector('title')?.textContent
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content')
      const h1 = document.querySelector('h1')?.textContent
      const canonicalLink = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
      
      return {
        hasTitle: !!title && title.length > 0 && title.length <= 60,
        hasMetaDescription: !!metaDescription && metaDescription.length > 0 && metaDescription.length <= 160,
        hasH1: !!h1 && h1.length > 0,
        hasCanonical: !!canonicalLink,
        title,
        metaDescription,
        h1,
      }
    })
    
    const issues = []
    if (!seoChecks.hasTitle) issues.push('Missing or invalid title tag')
    if (!seoChecks.hasMetaDescription) issues.push('Missing or invalid meta description')
    if (!seoChecks.hasH1) issues.push('Missing H1 tag')
    
    const pass = issues.length === 0
    
    return {
      message: () => 
        pass 
          ? 'Page has valid SEO elements'
          : `Page has SEO issues: ${issues.join(', ')}`,
      pass,
    }
  },
})

/**
 * Check if page has responsive design
 */
expect.extend({
  async toHaveResponsiveDesign(page: any) {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop' },
      { width: 1920, height: 1080, name: 'Large Desktop' },
    ]
    
    const issues = []
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.waitForTimeout(500) // Wait for layout to adjust
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      
      const hasOverflowingElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'))
        return elements.some(el => {
          const rect = el.getBoundingClientRect()
          return rect.right > window.innerWidth
        })
      })
      
      if (hasHorizontalScroll) {
        issues.push(`Horizontal scroll detected on ${viewport.name} (${viewport.width}x${viewport.height})`)
      }
      
      if (hasOverflowingElements) {
        issues.push(`Overflowing elements detected on ${viewport.name} (${viewport.width}x${viewport.height})`)
      }
    }
    
    const pass = issues.length === 0
    
    return {
      message: () => 
        pass 
          ? 'Page is responsive across all tested viewports'
          : `Page has responsive design issues: ${issues.join(', ')}`,
      pass,
    }
  },
})

/**
 * Check if form has proper validation
 */
expect.extend({
  async toHaveValidForm(locator: any) {
    const formElement = locator
    
    const validationChecks = await formElement.evaluate((form: HTMLFormElement) => {
      const inputs = Array.from(form.querySelectorAll('input, textarea, select'))
      const issues = []
      
      inputs.forEach((input: any) => {
        // Check for labels
        const hasLabel = input.labels && input.labels.length > 0
        const hasAriaLabel = input.getAttribute('aria-label')
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          issues.push(`Input ${input.name || input.type} is missing a label`)
        }
        
        // Check for required field indicators
        if (input.required) {
          const hasRequiredIndicator = input.getAttribute('aria-required') === 'true' ||
                                      form.querySelector(`label[for="${input.id}"]`)?.textContent?.includes('*')
          
          if (!hasRequiredIndicator) {
            issues.push(`Required input ${input.name || input.type} is missing required indicator`)
          }
        }
        
        // Check for error message containers
        if (input.getAttribute('aria-invalid') === 'true') {
          const hasErrorMessage = input.getAttribute('aria-describedby') &&
                                 form.querySelector(`#${input.getAttribute('aria-describedby')}`)
          
          if (!hasErrorMessage) {
            issues.push(`Invalid input ${input.name || input.type} is missing error message`)
          }
        }
      })
      
      return { issues }
    })
    
    const pass = validationChecks.issues.length === 0
    
    return {
      message: () => 
        pass 
          ? 'Form has proper validation and accessibility'
          : `Form has validation issues: ${validationChecks.issues.join(', ')}`,
      pass,
    }
  },
})

/**
 * Jest custom matchers for unit tests
 */
if (typeof expect !== 'undefined' && expect.extend) {
  expect.extend({
    toHaveValidEmail(received: string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const pass = emailRegex.test(received)
      
      return {
        message: () => 
          pass 
            ? `Expected ${received} not to be a valid email`
            : `Expected ${received} to be a valid email`,
        pass,
      }
    },
    
    toHaveMinLength(received: string, minLength: number) {
      const pass = received.length >= minLength
      
      return {
        message: () => 
          pass 
            ? `Expected ${received} not to have minimum length of ${minLength}`
            : `Expected ${received} to have minimum length of ${minLength}, but got ${received.length}`,
        pass,
      }
    },
    
    toBeValidBlogPost(received: any) {
      const requiredFields = ['title', 'content', 'excerpt']
      const missingFields = requiredFields.filter(field => !received[field] || received[field].trim() === '')
      const pass = missingFields.length === 0
      
      return {
        message: () => 
          pass 
            ? 'Blog post has all required fields'
            : `Blog post is missing required fields: ${missingFields.join(', ')}`,
        pass,
      }
    },
    
    toBeValidContactSubmission(received: any) {
      const requiredFields = ['name', 'email', 'message']
      const missingFields = requiredFields.filter(field => !received[field] || received[field].trim() === '')
      
      const emailValid = received.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(received.email) : false
      const messageValid = received.message ? received.message.trim().length >= 10 : false
      
      const issues = []
      if (missingFields.length > 0) issues.push(`Missing fields: ${missingFields.join(', ')}`)
      if (received.email && !emailValid) issues.push('Invalid email format')
      if (received.message && !messageValid) issues.push('Message too short (minimum 10 characters)')
      
      const pass = issues.length === 0
      
      return {
        message: () => 
          pass 
            ? 'Contact submission is valid'
            : `Contact submission is invalid: ${issues.join(', ')}`,
        pass,
      }
    },
  })
}

// TypeScript declarations for Jest custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveValidEmail(): R
      toHaveMinLength(minLength: number): R
      toBeValidBlogPost(): R
      toBeValidContactSubmission(): R
    }
  }
}