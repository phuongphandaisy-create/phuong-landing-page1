import { BlogPost, User, ContactSubmission } from '@/shared/types'

/**
 * Mock User Data
 */
export const mockUsers = {
  admin: {
    id: '1',
    username: 'admin',
    password: 'password',
    createdAt: new Date('2024-01-01'),
  } as User,
  
  testUser: {
    id: '2',
    username: 'testuser',
    password: 'testpass',
    createdAt: new Date('2024-01-02'),
  } as User,
}

/**
 * Mock Blog Post Data
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14',
    content: `# Getting Started with Next.js 14

Next.js 14 introduces several exciting features that make building React applications even more powerful and efficient.

## Key Features

- **App Router**: The new routing system based on React Server Components
- **Server Actions**: Direct server-side functions that can be called from client components
- **Improved Performance**: Better optimization and faster builds

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js application with all the latest features enabled by default.`,
    excerpt: 'Learn about the exciting new features in Next.js 14 and how to get started with the App Router.',
    authorId: '1',
    author: mockUsers.admin,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  {
    id: '2',
    title: 'TypeScript Best Practices for React',
    content: `# TypeScript Best Practices for React

TypeScript provides excellent type safety for React applications. Here are some best practices to follow.

## Component Props

Always define interfaces for your component props:

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  )
}
\`\`\`

## State Management

Use proper typing for useState:

\`\`\`typescript
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState<boolean>(false)
\`\`\``,
    excerpt: 'Essential TypeScript patterns and best practices for building type-safe React applications.',
    authorId: '1',
    author: mockUsers.admin,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  
  {
    id: '3',
    title: 'Testing React Components with Jest and Testing Library',
    content: `# Testing React Components with Jest and Testing Library

Testing is crucial for maintaining reliable React applications. Here's how to test components effectively.

## Basic Component Test

\`\`\`typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
\`\`\`

## Testing Hooks

\`\`\`typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
\`\`\``,
    excerpt: 'Learn how to write comprehensive tests for React components using Jest and Testing Library.',
    authorId: '2',
    author: mockUsers.testUser,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
]

/**
 * Mock Contact Submissions
 */
export const mockContactSubmissions: ContactSubmission[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'I am interested in learning more about your services. Could you please provide more information about your pricing and packages?',
    createdAt: new Date('2024-01-10'),
  },
  
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    message: 'Great blog posts! I especially enjoyed the article about Next.js 14. Do you have any plans to write about server components?',
    createdAt: new Date('2024-01-12'),
  },
  
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    message: 'I found a small bug in your contact form validation. When I enter a very long message, the form seems to have issues. Could you please look into this?',
    createdAt: new Date('2024-01-14'),
  },
]

/**
 * Mock API Responses
 */
export const mockApiResponses = {
  // Successful responses
  contactSuccess: {
    success: true,
    data: {
      id: '1',
      message: 'Contact form submitted successfully'
    }
  },
  
  blogPostsSuccess: {
    success: true,
    data: mockBlogPosts
  },
  
  blogPostCreateSuccess: {
    success: true,
    data: mockBlogPosts[0]
  },
  
  // Error responses
  contactError: {
    success: false,
    error: {
      message: 'Internal server error. Please try again later.',
      code: 'INTERNAL_ERROR'
    }
  },
  
  validationError: {
    success: false,
    error: {
      message: 'All fields are required',
      code: 'VALIDATION_ERROR'
    }
  },
  
  authError: {
    success: false,
    error: {
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    }
  },
  
  notFoundError: {
    success: false,
    error: {
      message: 'Resource not found',
      code: 'NOT_FOUND'
    }
  }
}

/**
 * Mock Form Data
 */
export const mockFormData = {
  validContact: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a valid test message that meets the minimum length requirement for the contact form.'
  },
  
  invalidContact: {
    name: '',
    email: 'invalid-email',
    message: 'Short'
  },
  
  validBlogPost: {
    title: 'Test Blog Post',
    excerpt: 'This is a test blog post excerpt for testing purposes.',
    content: `# Test Blog Post

This is a test blog post content for testing purposes.

## Features

- Feature 1
- Feature 2
- Feature 3

## Conclusion

This concludes our test blog post.`
  },
  
  invalidBlogPost: {
    title: '',
    excerpt: '',
    content: ''
  },
  
  validLogin: {
    username: 'admin',
    password: 'password'
  },
  
  invalidLogin: {
    username: 'wronguser',
    password: 'wrongpass'
  }
}

/**
 * Mock Session Data
 */
export const mockSessions = {
  authenticated: {
    user: {
      id: '1',
      username: 'admin'
    },
    expires: '2024-12-31'
  },
  
  unauthenticated: null
}

/**
 * Test Data Generators
 */
export class TestDataGenerator {
  static generateBlogPost(overrides: Partial<BlogPost> = {}): BlogPost {
    const id = Math.random().toString(36).substr(2, 9)
    return {
      id,
      title: `Test Blog Post ${id}`,
      content: `# Test Blog Post ${id}\n\nThis is test content for blog post ${id}.`,
      excerpt: `Test excerpt for blog post ${id}`,
      authorId: '1',
      author: mockUsers.admin,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    }
  }
  
  static generateContactSubmission(overrides: Partial<ContactSubmission> = {}): ContactSubmission {
    const id = Math.random().toString(36).substr(2, 9)
    return {
      id,
      name: `Test User ${id}`,
      email: `test${id}@example.com`,
      message: `This is a test message from user ${id}. It contains enough text to pass validation requirements.`,
      createdAt: new Date(),
      ...overrides
    }
  }
  
  static generateUser(overrides: Partial<User> = {}): User {
    const id = Math.random().toString(36).substr(2, 9)
    return {
      id,
      username: `testuser${id}`,
      password: 'testpass',
      createdAt: new Date(),
      ...overrides
    }
  }
}

/**
 * Test Scenarios
 */
export const testScenarios = {
  // Contact form scenarios
  contactForm: {
    validSubmission: {
      input: mockFormData.validContact,
      expectedResponse: mockApiResponses.contactSuccess
    },
    invalidEmail: {
      input: { ...mockFormData.validContact, email: 'invalid-email' },
      expectedError: 'Please enter a valid email address'
    },
    shortMessage: {
      input: { ...mockFormData.validContact, message: 'Short' },
      expectedError: 'Message must be at least 10 characters long'
    },
    emptyFields: {
      input: mockFormData.invalidContact,
      expectedErrors: ['Name is required', 'Email is required', 'Message is required']
    }
  },
  
  // Authentication scenarios
  auth: {
    validLogin: {
      input: mockFormData.validLogin,
      expectedResult: 'success'
    },
    invalidLogin: {
      input: mockFormData.invalidLogin,
      expectedError: 'Invalid username or password'
    },
    emptyCredentials: {
      input: { username: '', password: '' },
      expectedErrors: ['Username is required', 'Password is required']
    }
  },
  
  // Blog management scenarios
  blog: {
    createPost: {
      input: mockFormData.validBlogPost,
      expectedResponse: mockApiResponses.blogPostCreateSuccess
    },
    invalidPost: {
      input: mockFormData.invalidBlogPost,
      expectedErrors: ['Title is required', 'Content is required', 'Excerpt is required']
    }
  }
}