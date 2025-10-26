import { NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if tables exist by trying to count users
    const userCount = await prisma.user.count()
    const blogPostCount = await prisma.blogPost.count()
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: {
        connected: true,
        users: userCount,
        blogPosts: blogPostCount
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      database: {
        connected: false,
        error: error.message
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}