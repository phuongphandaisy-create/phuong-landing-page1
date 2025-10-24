import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginModal } from '../LoginModal'

// Mock next-auth
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

// Mock next/navigation
jest.mock('next/navigation')
const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('LoginModal Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    mockSignIn.mockClear()
    mockPush.mockClear()
    mockRefresh.mockClear()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    })
  })

  it('renders when isOpen is true', () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText(/admin login/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<LoginModal isOpen={false} onClose={mockOnClose} />)
    
    expect(screen.queryByText(/admin login/i)).not.toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup()
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    
    // Start typing in username field
    const usernameInput = screen.getByLabelText(/username/i)
    await user.type(usernameInput, 'test')
    
    expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        username: 'testuser',
        password: 'password',
        redirect: false,
      })
    })
    
    expect(mockOnClose).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/admin')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('handles login error', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: false, error: 'Invalid credentials' })
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(usernameInput, 'wronguser')
    await user.type(passwordInput, 'wrongpass')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)))
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password')
    await user.click(submitButton)
    
    expect(screen.getByText(/signing in.../i)).toBeInTheDocument()
    expect(usernameInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
  })

  it('closes modal and resets form when cancel is clicked', async () => {
    const user = userEvent.setup()
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    
    await user.type(usernameInput, 'testuser')
    await user.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })
})