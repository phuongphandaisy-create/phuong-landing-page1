import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

// Mock session data
export const mockSession = {
  user: {
    id: '1',
    username: 'testuser',
  },
  expires: '2024-12-31',
}

// Mock blog post data
export const mockBlogPost = {
  id: '1',
  title: 'Test Blog Post',
  content: 'This is a test blog post content.',
  excerpt: 'This is a test excerpt.',
  authorId: '1',
  author: {
    id: '1',
    username: 'testuser',
    password: 'password',
    createdAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock contact submission data
export const mockContactSubmission = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  message: 'This is a test message.',
  createdAt: new Date(),
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={null}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Helper function to create authenticated render
export const renderWithAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AuthenticatedProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <SessionProvider session={mockSession}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: AuthenticatedProviders, ...options })
}