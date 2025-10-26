import { NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

export async function POST() {
  try {
    // Check if we're in production and if database needs initialization
    console.log('Initializing database...')
    
    // Try to connect and check if admin user exists
    await prisma.$connect()
    
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    })
    
    if (!adminUser) {
      console.log('Creating admin user...')
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
      const newAdmin = await prisma.user.create({
        data: {
          username: 'admin',
          password: adminPassword
        }
      })
      
      // Create sample blog posts
      await prisma.blogPost.createMany({
        data: [
          {
            title: 'Welcome to Our AI-Assisted Landing Page',
            excerpt: 'Discover how AI can transform your development workflow with our modern landing page solution.',
            content: `# Welcome to Our AI-Assisted Landing Page

This is a sample blog post to demonstrate the blog functionality of our AI-assisted landing page. 

## Features

- Modern UI/UX with gradient designs
- Full blog management system
- Responsive design for all devices
- Dark mode support
- Contact form integration

## Getting Started

This landing page is built with Next.js 14, TypeScript, and Tailwind CSS, providing a solid foundation for modern web development.

Feel free to explore the admin panel to manage your content!`,
            authorId: newAdmin.id,
          },
          {
            title: 'Building Modern Web Applications',
            excerpt: 'Learn about the latest trends and best practices in modern web development.',
            content: `# Building Modern Web Applications

In today's fast-paced digital world, creating modern web applications requires the right tools and methodologies.

## Key Technologies

- **Next.js**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: Modern database toolkit

## Best Practices

1. Component-based architecture
2. Type safety throughout the application
3. Responsive design principles
4. Performance optimization
5. Accessibility considerations

Start building amazing applications today!`,
            authorId: newAdmin.id,
          }
        ]
      })
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        created: {
          adminUser: true,
          samplePosts: 2
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database already initialized',
      adminExists: true
    })
    
  } catch (error) {
    console.error('Database initialization failed:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: 'Failed to initialize database',
        details: error.message
      }
    }, { status: 500 })
  }
}