import { NextRequest } from 'next/server'
import { POST } from '../route'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/prisma')

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/contact API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRequest = (body: any) => ({
    json: async () => body,
  }) as NextRequest

  describe('POST /api/contact', () => {
    it('creates contact submission successfully', async () => {
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      }
      const mockCreatedSubmission = {
        id: '1',
        ...requestBody,
        email: requestBody.email.toLowerCase(),
        createdAt: new Date(),
      }

      mockPrisma.contactSubmission.create.mockResolvedValue(mockCreatedSubmission)

      const request = mockRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('1')
      expect(data.data.message).toBe('Contact form submitted successfully')
      expect(mockPrisma.contactSubmission.create).toHaveBeenCalledWith({
        data: {
          name: requestBody.name,
          email: requestBody.email.toLowerCase(),
          message: requestBody.message,
        },
      })
    })

    it('validates required fields', async () => {
      const request = mockRequest({
        name: '',
        email: 'john@example.com',
        message: 'Test message',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('All fields are required')
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('validates email format', async () => {
      const request = mockRequest({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message that is long enough.',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Please provide a valid email address')
      expect(data.error.code).toBe('INVALID_EMAIL')
    })

    it('validates message length', async () => {
      const request = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'short',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Message must be at least 10 characters long')
      expect(data.error.code).toBe('MESSAGE_TOO_SHORT')
    })

    it('handles database errors', async () => {
      mockPrisma.contactSubmission.create.mockRejectedValue(new Error('Database error'))

      const request = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Internal server error. Please try again later.')
      expect(data.error.code).toBe('INTERNAL_ERROR')
    })

    it('trims whitespace and converts email to lowercase', async () => {
      const requestBody = {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        message: '  This is a test message that is long enough.  ',
      }
      const mockCreatedSubmission = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
        createdAt: new Date(),
      }

      mockPrisma.contactSubmission.create.mockResolvedValue(mockCreatedSubmission)

      const request = mockRequest(requestBody)
      const response = await POST(request)

      expect(mockPrisma.contactSubmission.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message that is long enough.',
        },
      })
    })
  })
})