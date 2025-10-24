import React from 'react'

/**
 * Mock setup utilities for Jest
 */
export class MockSetup {
  static setupGlobalMocks() {
    // Mock fetch globally
    global.fetch = jest.fn()
    
    // Mock console methods in tests
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    }
  }

  static setupNextJsMocks() {
    // Mock Next.js router
    jest.mock('next/navigation', () => ({
      useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
      })),
      useSearchParams: jest.fn(() => new URLSearchParams()),
      usePathname: jest.fn(() => '/'),
    }))

    // Mock Next.js image
    jest.mock('next/image', () => ({
      __esModule: true,
      default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return React.createElement('img', props)
      },
    }))
  }

  static setupAuthMocks() {
    // Mock Next-Auth
    jest.mock('next-auth/react', () => ({
      useSession: jest.fn(() => ({
        data: null,
        status: 'unauthenticated',
      })),
      signIn: jest.fn(),
      signOut: jest.fn(),
      SessionProvider: ({ children }: { children: React.ReactNode }) => children,
    }))
  }

  static resetAllMocks() {
    jest.clearAllMocks()
    jest.resetAllMocks()
  }
}

/**
 * Test data setup utilities for Jest
 */
export class TestDataSetup {
  static async seedBlogPosts() {
    // This would seed blog posts for testing
    console.log('📝 Seeding blog posts...')
  }

  static async seedUsers() {
    // This would seed users for testing
    console.log('👥 Seeding users...')
  }

  static async cleanupTestData() {
    // This would clean up test data
    console.log('🧹 Cleaning up test data...')
  }
}