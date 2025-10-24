'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BlogPost } from '@/types'

interface BlogPostPageProps {
  params: { slug: string }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/${params.slug}`)
      const result = await response.json()

      if (result.success) {
        setPost(result.data)
      } else {
        setError(result.error?.message || 'Blog post not found')
      }
    } catch (err) {
      setError('Failed to fetch blog post')
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  useEffect(() => {
    fetchPost()
    fetchAllPosts()
  }, [params.slug, fetchPost])

  const fetchAllPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      const result = await response.json()

      if (result.success) {
        setAllPosts(result.data)
      }
    } catch (err) {
      console.error('Error fetching all posts:', err)
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ))
  }

  // Get navigation posts (previous and next)
  const currentIndex = allPosts.findIndex(p => p.id === params.slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-24"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Không tìm thấy bài viết
              </h1>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {error || 'Bài viết bạn đang tìm kiếm không tồn tại.'}
              </p>
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog Link */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-8 md:p-12">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {post.author.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-xl text-gray-600 dark:text-gray-300 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500">
                  {post.excerpt}
                </div>
                
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {formatContent(post.content)}
                </div>
              </div>
            </div>
          </article>

          {/* Navigation between posts */}
          {(previousPost || nextPost) && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousPost && (
                <Link 
                  href={`/blog/${previousPost.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200"
                >
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Bài trước
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                    {previousPost.title}
                  </h3>
                </Link>
              )}
              
              {nextPost && (
                <Link 
                  href={`/blog/${nextPost.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 md:text-right"
                >
                  <div className="flex items-center justify-end text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">
                    Bài tiếp theo
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                    {nextPost.title}
                  </h3>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}