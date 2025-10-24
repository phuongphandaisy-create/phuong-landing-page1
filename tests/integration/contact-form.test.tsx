import { render, screen, waitFor } from '@/shared/test-utils'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/frontend/components/forms/ContactForm'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('Contact Form Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Complete Contact Form Workflow', () => {
    it('handles successful contact form submission workflow', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: '1',
            message: 'Contact form submitted successfully',
          },
        }),
      } as Response)

      const mockOnSuccess = jest.fn()
      render(<ContactForm onSuccess={mockOnSuccess} />)

      // Fill out the form
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'This is a test message that is long enough to pass validation.')

      // Submit the form
      await user.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'This is a test message that is long enough to pass validation.',
          }),
        })
      })

      // Verify success feedback
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
      expect(mockOnSuccess).toHaveBeenCalled()

      // Verify form is reset
      expect(nameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(messageInput).toHaveValue('')
    })

    it('handles contact form submission with API error', async () => {
      const user = userEvent.setup()
      
      // Mock API error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: {
            message: 'Internal server error. Please try again later.',
            code: 'INTERNAL_ERROR',
          },
        }),
      } as Response)

      render(<ContactForm />)

      // Fill out the form
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'This is a test message that is long enough.')

      // Submit the form
      await user.click(submitButton)

      // Verify error feedback
      await waitFor(() => {
        expect(screen.getByText(/sorry, there was an error sending your message/i)).toBeInTheDocument()
      })

      // Verify form data is preserved
      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(messageInput).toHaveValue('This is a test message that is long enough.')
    })

    it('handles complete validation workflow', async () => {
      const user = userEvent.setup()
      
      render(<ContactForm />)

      const submitButton = screen.getByRole('button', { name: /send message/i })

      // Submit empty form
      await user.click(submitButton)

      // Verify all validation errors appear
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()

      // Verify no API call was made
      expect(mockFetch).not.toHaveBeenCalled()

      // Fill name field and verify error clears
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'John')
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()

      // Fill invalid email and verify email validation
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()

      // Fix email and add short message
      await user.clear(emailInput)
      await user.type(emailInput, 'john@example.com')
      const messageInput = screen.getByLabelText(/message/i)
      await user.type(messageInput, 'short')
      await user.click(submitButton)
      expect(screen.getByText(/message must be at least 10 characters long/i)).toBeInTheDocument()
    })

    it('handles loading state during submission', async () => {
      const user = userEvent.setup()
      
      // Mock slow API response
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ success: true, data: { id: '1' } }),
          } as Response), 100)
        )
      )

      render(<ContactForm />)

      // Fill and submit form
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'This is a test message that is long enough.')
      await user.click(submitButton)

      // Verify loading state
      expect(screen.getByText(/sending.../i)).toBeInTheDocument()
      expect(nameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(messageInput).toBeDisabled()
      expect(submitButton).toBeDisabled()

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
      })
    })

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<ContactForm />)

      // Fill and submit form
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'This is a test message that is long enough.')
      await user.click(submitButton)

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/sorry, there was an error sending your message/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form State Management', () => {
    it('manages form state correctly throughout workflow', async () => {
      const user = userEvent.setup()
      
      render(<ContactForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)

      // Test initial state
      expect(nameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(messageInput).toHaveValue('')

      // Test state updates
      await user.type(nameInput, 'John')
      expect(nameInput).toHaveValue('John')

      await user.type(emailInput, 'john@example.com')
      expect(emailInput).toHaveValue('john@example.com')

      await user.type(messageInput, 'Test message')
      expect(messageInput).toHaveValue('Test message')

      // Test clearing
      await user.clear(nameInput)
      expect(nameInput).toHaveValue('')
    })

    it('handles form reset after successful submission', async () => {
      const user = userEvent.setup()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: '1' } }),
      } as Response)

      render(<ContactForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })

      // Fill form
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'This is a test message that is long enough.')

      // Submit and verify reset
      await user.click(submitButton)

      await waitFor(() => {
        expect(nameInput).toHaveValue('')
        expect(emailInput).toHaveValue('')
        expect(messageInput).toHaveValue('')
      })
    })
  })
})