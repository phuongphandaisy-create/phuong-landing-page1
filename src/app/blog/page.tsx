'use client'

import { useState, useEffect } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import { BlogPost } from '@/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (retryWithInit = true) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/blog')
      const result = await response.json()

      if (result.success) {
        setPosts(result.data)
        setError(null)
      } else {
        // If fetch failed and we haven't tried initializing yet, try to init database
        if (retryWithInit && result.error?.code === 'FETCH_ERROR') {
          console.log('Attempting to initialize database...')
          try {
            const initResponse = await fetch('/api/init-db', { method: 'POST' })
            const initResult = await initResponse.json()
            
            if (initResult.success) {
              console.log('Database initialized, retrying fetch...')
              // Retry fetching posts after initialization
              return fetchPosts(false)
            }
          } catch (initError) {
            console.error('Database initialization failed:', initError)
          }
        }
        
        const errorMsg = result.error?.message || 'Failed to fetch blog posts'
        const details = result.error?.details ? ` (${result.error.details})` : ''
        setError(errorMsg + details)
      }
    } catch (err) {
      setError(`Network error: ${err.message}`)
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Khám phá những bài viết mới nhất về công nghệ và phát triển phần mềm
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Blog
            </h1>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-lg mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => fetchPosts()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Thử lại
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/health')
                      const result = await response.json()
                      console.log('Health check result:', result)
                      alert('Check console for health status')
                    } catch (err) {
                      console.error('Health check failed:', err)
                      alert('Health check failed - see console')
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Kiểm tra hệ thống
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá những bài viết mới nhất về công nghệ và phát triển phần mềm
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-12 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hãy quay lại sau để đọc những bài viết mới nhất
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination placeholder - can be implemented later if needed */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400">
              Hiển thị {posts.length} bài viết
            </p>
          </div>
        )}
      </div>
    </div>
  )
}