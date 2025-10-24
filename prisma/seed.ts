import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // Plain text for demo purposes as per requirements
    },
  })

  console.log('✅ Created admin user:', adminUser)

  // Create some sample blog posts
  const samplePost1 = await prisma.blogPost.upsert({
    where: { id: 'sample-post-1' },
    update: {},
    create: {
      id: 'sample-post-1',
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
      authorId: adminUser.id,
    },
  })

  const samplePost2 = await prisma.blogPost.upsert({
    where: { id: 'sample-post-2' },
    update: {},
    create: {
      id: 'sample-post-2',
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
      authorId: adminUser.id,
    },
  })

  console.log('✅ Created sample blog posts:', { samplePost1, samplePost2 })

  // Create a sample contact submission
  const sampleContact = await prisma.contactSubmission.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'Hello! I\'m interested in learning more about your services. This is a sample contact submission.',
    },
  })

  console.log('✅ Created sample contact submission:', sampleContact)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })