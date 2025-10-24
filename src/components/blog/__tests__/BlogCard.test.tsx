import { render, screen } from '@/lib/test-utils'
import { mockBlogPost } from '@/lib/test-utils'
import BlogCard from '../BlogCard'

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('BlogCard Component', () => {
  it('renders blog post information', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    expect(screen.getByText(mockBlogPost.title)).toBeInTheDocument()
    expect(screen.getByText(mockBlogPost.excerpt)).toBeInTheDocument()
    expect(screen.getByText(mockBlogPost.author.username)).toBeInTheDocument()
    expect(screen.getByText(/read more/i)).toBeInTheDocument()
  })

  it('renders correct link to blog post', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/blog/${mockBlogPost.id}`)
  })

  it('formats date correctly', () => {
    const testPost = {
      ...mockBlogPost,
      createdAt: new Date('2024-01-15'),
    }
    
    render(<BlogCard post={testPost} />)
    
    // Check if date is formatted (Vietnamese locale)
    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('handles string date format', () => {
    const testPost = {
      ...mockBlogPost,
      createdAt: '2024-01-15T00:00:00.000Z' as any,
    }
    
    render(<BlogCard post={testPost} />)
    
    // Should not throw error and should render date
    expect(screen.getByText(/15/)).toBeInTheDocument()
  })

  it('applies hover and active styles', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    const cardContainer = screen.getByRole('link').firstChild as HTMLElement
    expect(cardContainer).toHaveClass('group', 'hover:shadow-xl', 'hover:-translate-y-1')
    
    const title = screen.getByText(mockBlogPost.title)
    expect(title).toHaveClass('group-hover:text-indigo-600')
    
    const readMore = screen.getByText(/read more/i)
    expect(readMore).toHaveClass('group-hover:text-indigo-700')
  })

  it('renders with proper accessibility attributes', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('tap-highlight-none')
    
    const cardContainer = link.firstChild as HTMLElement
    expect(cardContainer).toHaveClass('touch-target')
  })

  it('truncates long content with line-clamp classes', () => {
    const longPost = {
      ...mockBlogPost,
      title: 'This is a very long title that should be truncated when it exceeds the maximum number of lines allowed',
      excerpt: 'This is a very long excerpt that should be truncated when it exceeds the maximum number of lines allowed for the excerpt section of the blog card component.',
    }
    
    render(<BlogCard post={longPost} />)
    
    const title = screen.getByText(longPost.title)
    const excerpt = screen.getByText(longPost.excerpt)
    
    expect(title).toHaveClass('line-clamp-2')
    expect(excerpt).toHaveClass('line-clamp-3')
  })
})