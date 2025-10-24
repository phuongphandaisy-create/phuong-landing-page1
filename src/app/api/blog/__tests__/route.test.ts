import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma')

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/blog API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/blog', () => {
    it('returns all blog posts successfully', async () => {
      const mockBlogPosts = [
        {
          id: '1',
          title: 'Test Post 1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          authorId: 'user1',
          author: { id: 'user1', username: 'testuser', createdAt: new Date() },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Test Post 2',
          content: 'Content 2',
          excerpt: 'Excerpt 2',
          authorId: 'user1',
          author: { id: 'user1', username: 'testuser', createdAt: new Date() },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockPrisma.blogPost.findMany.mockResolvedValue(mockBlogPosts)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockBlogPosts)
      expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              id: true,
              username: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('handles database errors', async () => {
      mockPrisma.blogPost.findMany.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Failed to fetch blog posts')
      expect(data.error.code).toBe('FETCH_ERROR')
    })
  })

  describe('POST /api/blog', () => {
    const mockRequest = (body: any) => ({
      json: async () => body,
    }) as NextRequest

    it('creates blog post successfully when authenticated', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      const requestBody = {
        title: 'New Blog Post',
        content: 'This is the content of the new blog post.',
        excerpt: 'This is the excerpt.',
      }
      const mockCreatedPost = {
        id: '1',
        ...requestBody,
        authorId: 'user1',
        author: { id: 'user1', username: 'testuser', createdAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.blogPost.create.mockResolvedValue(mockCreatedPost)

      const request = mockRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockCreatedPost)
      expect(mockPrisma.blogPost.create).toHaveBeenCalledWith({
        data: {
          title: requestBody.title,
          content: requestBody.content,
          excerpt: requestBody.excerpt,
          authorId: 'user1',
        },
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
        title: 'New Blog Post',
        content: 'Content',
        excerpt: 'Excerpt',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Authentication required')
      expect(data.error.code).toBe('UNAUTHORIZED')
    })

    it('validates required fields', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const request = mockRequest({
        title: '',
        content: 'Content',
        excerpt: 'Excerpt',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Title, content, and excerpt are required')
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })

    it('handles database errors during creation', async () => {
      const mockSession = {
        user: { id: 'user1', username: 'testuser' },
      }
      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.blogPost.create.mockRejectedValue(new Error('Database error'))

      const request = mockRequest({
        title: 'New Blog Post',
        content: 'Content',
        excerpt: 'Excerpt',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Failed to create blog post')
      expect(data.error.code).toBe('CREATE_ERROR')
    })
  })
})