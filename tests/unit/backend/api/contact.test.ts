import { NextRequest } from 'next/server'
import { submitContactForm } from '@/backend/api/contact/handlers'

// Mock Prisma
const mockPrisma = {
  contactSubmission: {
    create: jest.fn(),
  },
}

jest.mock('@/backend/lib/prisma', () => ({
  prisma: mockPrisma,
}))

describe('Contact API Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles valid contact form submission', async () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough.',
    }

    const mockCreatedSubmission = {
      id: '1',
      ...mockContactData,
      createdAt: new Date(),
    }

    mockPrisma.contactSubmission.create.mockResolvedValue(mockCreatedSubmission)

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(mockContactData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await submitContactForm(request)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.success).toBe(true)
    expect(result.data.id).toBe('1')
    expect(mockPrisma.contactSubmission.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      },
    })
  })

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'john@example.com',
        message: 'Test message',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await submitContactForm(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('VALIDATION_ERROR')
    expect(mockPrisma.contactSubmission.create).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message that is long enough.',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await submitContactForm(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('INVALID_EMAIL')
    expect(mockPrisma.contactSubmission.create).not.toHaveBeenCalled()
  })

  it('validates message length', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await submitContactForm(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('MESSAGE_TOO_SHORT')
    expect(mockPrisma.contactSubmission.create).not.toHaveBeenCalled()
  })

  it('handles database errors', async () => {
    mockPrisma.contactSubmission.create.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await submitContactForm(request)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('INTERNAL_ERROR')
  })
})