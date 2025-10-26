import { NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

export async function POST() {
  try {
    // Only allow this in production for emergency reset
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        success: false,
        error: 'This endpoint is only available in production'
      }, { status: 403 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    // Update admin user password
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: adminPassword
      },
      create: {
        username: 'admin',
        password: adminPassword
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin password reset successfully',
      adminUser: {
        id: adminUser.id,
        username: adminUser.username,
        updatedAt: adminUser.createdAt
      }
    })

  } catch (error) {
    console.error('Admin password reset failed:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: 'Failed to reset admin password',
        details: error.message
      }
    }, { status: 500 })
  }
}