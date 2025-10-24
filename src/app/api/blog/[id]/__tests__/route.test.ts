import { NextRequest } from 'next/server'
import { GET, PUT, DELETE } from '../route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma')

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/blog/[id] API Routes', () => {
  const mockParams = { params: { id: 'test-id' } }
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/blog/[id]', () => {
    it('returns blog post successfully', async () => {
      const mockBlogPost = {
        id: 'test-id',
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        authorId: 'user1',
        author: { id: 'user1', username: 'testuser', createdAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.blogPost.findUnique.mockResolvedValue(mockBlogPost)

      const request = {} as NextRequest
      const response = await GET(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockBlogPost)
      expect(mockPrisma.blogPost.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              createdAt: true,
            },
          },
        },
      })
    })

    it('returns 404 when blog post not found', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue(null)

      const request = {} as NextRequest
      const response = await GET(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Blog post not found')
      expect(data.error.code).toBe('NOT_FOUND')
    })

    it('handles database errors', async () => {
      mockPrisma.blogPost.findUnique.mockRejectedValue(new Error('Database error'))

      const request = {} as NextRequest
      const response = await GET(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Failed to fetch blog post')
      expect(data.error.code).toBe('FETCH_ERROR')
    })
  })

  describe('PUT /api/blog/[id]', () => {
    const mockRequest = (body: any) => ({
      json: async () => body,
    }) as NextRequest

    it('updates blog post successfully when authenticated', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      const existingPost = {
        id: 'test-id',
        title: 'Old Title',
        content: 'Old content',
        excerpt: 'Old excerpt',
        authorId: 'user1',
      }
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        excerpt: 'Updated excerpt',
      }
      const updatedPost = {
        ...existingPost,
        ...updateData,
        author: { id: 'user1', username: 'testuser', createdAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.blogPost.findUnique.mockResolvedValue(existingPost)
      mockPrisma.blogPost.update.mockResolvedValue(updatedPost)

      const request = mockRequest(updateData)
      const response = await PUT(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedPost)
      expect(mockPrisma.blogPost.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              createdAt: true,
            },
          },
        },
      })
    })

    it('returns 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = mockRequest({
        title: 'Updated Title',
        content: 'Updated content',
        excerpt: 'Updated excerpt',
      })
      const response = await PUT(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Authentication required')
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('returns 404 when blog post not found', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.blogPost.findUnique.mockResolvedValue(null)

      const request = mockRequest({
        title: 'Updated Title',
        content: 'Updated content',
        excerpt: 'Updated excerpt',
      })
      const response = await PUT(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Blog post not found')
      expect(data.error.code).toBe('NOT_FOUND')
    })
  })

  describe('DELETE /api/blog/[id]', () => {
    it('deletes blog post successfully when authenticated', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      const existingPost = {
        id: 'test-id',
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        authorId: 'user1',
      }

      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.blogPost.findUnique.mockResolvedValue(existingPost)
      mockPrisma.blogPost.delete.mockResolvedValue(existingPost)

      const request = {} as NextRequest
      const response = await DELETE(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.message).toBe('Blog post deleted successfully')
      expect(mockPrisma.blogPost.delete).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      })
    })

    it('returns 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = {} as NextRequest
      const response = await DELETE(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Authentication required')
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('returns 404 when blog post not found', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.blogPost.findUnique.mockResolvedValue(null)

      const request = {} as NextRequest
      const response = await DELETE(request, mockParams)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Blog post not found')
      expect(data.error.code).toBe('NOT_FOUND')
    })
  })
})