import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('ContactForm Component', () => {
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    mockOnSuccess.mockClear()
    mockFetch.mockClear()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/message is required/i)).toBeInTheDocument()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    
    render(<ContactForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
  })

  it('validates message length', async () => {
    const user = userEvent.setup()
    
    render(<ContactForm />)
    
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(messageInput, 'short')
    await user.click(submitButton)
    
    expect(screen.getByText(/message must be at least 10 characters long/i)).toBeInTheDocument()
  })

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup()
    
    render(<ContactForm />)
    
    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    
    // Start typing in name field
    const nameInput = screen.getByLabelText(/name/i)
    await user.type(nameInput, 'John')
    
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
  })

  it('handles successful form submission', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
    
    render(<ContactForm onSuccess={mockOnSuccess} />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'This is a test message that is long enough.')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message that is long enough.',
        }),
      })
    })
    
    expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    expect(mockOnSuccess).toHaveBeenCalled()
    
    // Form should be reset
    expect(nameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(messageInput).toHaveValue('')
  })

  it('handles form submission error', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)
    
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'This is a test message that is long enough.')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/sorry, there was an error sending your message/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true } as Response), 100)))
    
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'This is a test message that is long enough.')
    await user.click(submitButton)
    
    expect(screen.getByText(/sending.../i)).toBeInTheDocument()
    expect(nameInput).toBeDisabled()
    expect(emailInput).toBeDisabled()
    expect(messageInput).toBeDisabled()
  })
})