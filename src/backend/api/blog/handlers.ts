import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/backend/lib/auth'
import { prisma } from '@/backend/lib/prisma'
import { BlogFormData } from '@/shared/types'

// GET /api/blog - Get all blog posts
export async function getBlogPosts() {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: blogPosts
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch blog posts',
          code: 'FETCH_ERROR'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new blog post (protected)
export async function createBlogPost(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED'
          }
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body: BlogFormData = await request.json()
    
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Title, content, and excerpt are required',
            code: 'VALIDATION_ERROR'
          }
        },
        { status: 400 }
      )
    }

    // Create blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        excerpt: body.excerpt.trim(),
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: blogPost
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to create blog post',
          code: 'CREATE_ERROR'
        }
      },
      { status: 500 }
    )
  }
}