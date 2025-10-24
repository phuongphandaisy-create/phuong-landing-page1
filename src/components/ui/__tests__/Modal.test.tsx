import { render, screen } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { Modal } from '../Modal'

describe('Modal Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.getByText(/modal content/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument()
  })

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.getByText(/test modal/i)).toBeInTheDocument()
    expect(screen.getByText(/modal content/i)).toBeInTheDocument()
  })

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    )
    
    const backdrop = document.querySelector('.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()
    
    if (backdrop) {
      await user.click(backdrop)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('closes when Escape key is pressed', async () => {
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    )
    
    await user.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm">
        <p>Small modal</p>
      </Modal>
    )
    
    let modalContent = document.querySelector('.max-w-sm')
    expect(modalContent).toBeInTheDocument()

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="lg">
        <p>Large modal</p>
      </Modal>
    )
    
    modalContent = document.querySelector('.max-w-lg')
    expect(modalContent).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal">
        <p>Modal content</p>
      </Modal>
    )
    
    const modalContent = document.querySelector('.custom-modal')
    expect(modalContent).toBeInTheDocument()
  })

  it('prevents body scroll when open', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('hidden')
    
    unmount()
    expect(document.body.style.overflow).toBe('unset')
  })
})