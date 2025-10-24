'use client'

import { useState } from 'react'
import { BlogPost } from '@/shared/types'
import { Button } from '@/frontend/components/ui/Button'

// Simple date formatting function
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

interface BlogListProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (postId: string) => void
  onPreview: (post: BlogPost) => void
  isLoading?: boolean
}

export function BlogList({ posts, onEdit, onDelete, onPreview, isLoading = false }: BlogListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(postId)
    try {
      await onDelete(postId)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No blog posts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first blog post to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 group"
        >
          {/* Post Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>By {post.author.username}</span>
              <span>{formatTimeAgo(new Date(post.createdAt))}</span>
            </div>

            {/* Content Preview */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {post.content.substring(0, 100)}...
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(post)}
                className="flex-1 text-xs"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
                className="flex-1 text-xs hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(post.id, post.title)}
                disabled={deletingId === post.id}
                className="flex-1 text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400"
              >
                {deletingId === post.id ? (
                  <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Delete
              </Button>
            </div>
          </div>

          {/* Hover Gradient Border Effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
        </div>
      ))}
    </div>
  )
}