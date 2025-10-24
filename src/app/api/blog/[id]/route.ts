import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BlogFormData } from '@/types'

// GET /api/blog/[id] - Get specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id: params.id
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

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Blog post not found',
            code: 'NOT_FOUND'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: blogPost
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch blog post',
          code: 'FETCH_ERROR'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[id] - Update blog post (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Blog post not found',
            code: 'NOT_FOUND'
          }
        },
        { status: 404 }
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

    // Update blog post
    const updatedPost = await prisma.blogPost.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        excerpt: body.excerpt.trim()
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
      data: updatedPost
    })

  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to update blog post',
          code: 'UPDATE_ERROR'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id] - Delete blog post (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Blog post not found',
            code: 'NOT_FOUND'
          }
        },
        { status: 404 }
      )
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Blog post deleted successfully' }
    })

  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to delete blog post',
          code: 'DELETE_ERROR'
        }
      },
      { status: 500 }
    )
  }
}