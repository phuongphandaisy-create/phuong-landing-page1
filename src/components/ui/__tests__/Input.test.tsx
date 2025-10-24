import { render, screen } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input Component', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md')
  })

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />)
    
    const label = screen.getByText(/username/i)
    const input = screen.getByPlaceholderText(/enter username/i)
    
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('renders with error message', () => {
    render(<Input error="This field is required" placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText(/enter text/i)
    const errorMessage = screen.getByText(/this field is required/i)
    
    expect(input).toHaveClass('border-red-500')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-600')
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<Input onChange={handleChange} placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText(/type here/i)
    await user.type(input, 'Hello World')
    
    expect(input).toHaveValue('Hello World')
    expect(handleChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText(/disabled input/i)
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="Custom input" />)
    
    const input = screen.getByPlaceholderText(/custom input/i)
    expect(input).toHaveClass('custom-input')
  })

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText(/email/i)).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText(/password/i)).toHaveAttribute('type', 'password')
  })
})