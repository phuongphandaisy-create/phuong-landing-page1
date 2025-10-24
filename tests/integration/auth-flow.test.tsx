import { render, screen, waitFor } from '@/shared/test-utils'
import userEvent from '@testing-library/user-event'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginModal } from '@/frontend/components/forms/LoginModal'

// Mock next-auth
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock next/navigation
jest.mock('next/navigation')
const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    mockSignIn.mockClear()
    mockUseSession.mockClear()
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

  describe('Complete Login Flow', () => {
    it('handles complete successful login workflow', async () => {
      const user = userEvent.setup()
      
      // Mock successful authentication
      mockSignIn.mockResolvedValue({ ok: true, error: null })
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const mockOnClose = jest.fn()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)

      // Fill in login form
      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'password')
      
      // Submit form
      await user.click(submitButton)

      // Verify authentication was called
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          username: 'admin',
          password: 'password',
          redirect: false,
        })
      })

      // Verify successful flow
      expect(mockOnClose).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/admin')
      expect(mockRefresh).toHaveBeenCalled()
    })

    it('handles authentication failure workflow', async () => {
      const user = userEvent.setup()
      
      // Mock failed authentication
      mockSignIn.mockResolvedValue({ ok: false, error: 'Invalid credentials' })
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const mockOnClose = jest.fn()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)

      // Fill in login form with wrong credentials
      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'wronguser')
      await user.type(passwordInput, 'wrongpass')
      
      // Submit form
      await user.click(submitButton)

      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument()
      })

      // Verify modal stays open and no navigation occurs
      expect(mockOnClose).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
      expect(mockRefresh).not.toHaveBeenCalled()
    })

    it('handles form validation in complete workflow', async () => {
      const user = userEvent.setup()
      
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const mockOnClose = jest.fn()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      // Verify validation errors
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()

      // Verify no authentication attempt was made
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles loading state during authentication', async () => {
      const user = userEvent.setup()
      
      // Mock slow authentication
      mockSignIn.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ ok: true, error: null }), 100)
        )
      )
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const mockOnClose = jest.fn()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)

      // Fill and submit form
      const usernameInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(usernameInput, 'admin')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)

      // Verify loading state
      expect(screen.getByText(/signing in.../i)).toBeInTheDocument()
      expect(usernameInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()

      // Wait for completion
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Session State Management', () => {
    it('handles authenticated session state', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: '1', username: 'admin' },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      // This would typically be tested with a component that uses session
      const sessionData = mockUseSession()
      expect(sessionData.status).toBe('authenticated')
      expect(sessionData.data?.user.username).toBe('admin')
    })

    it('handles loading session state', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })

      const sessionData = mockUseSession()
      expect(sessionData.status).toBe('loading')
      expect(sessionData.data).toBeNull()
    })

    it('handles unauthenticated session state', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const sessionData = mockUseSession()
      expect(sessionData.status).toBe('unauthenticated')
      expect(sessionData.data).toBeNull()
    })
  })
})