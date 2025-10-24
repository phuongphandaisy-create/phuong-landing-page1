import { NextRequest } from 'next/server'
import { getBlogPosts, createBlogPost } from '@/backend/api/blog/handlers'

export async function GET() {
  return getBlogPosts()
}

export async function POST(request: NextRequest) {
  return createBlogPost(request)
}