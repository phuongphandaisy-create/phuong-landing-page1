'use client'

import { BlogPost } from '@/shared/types'
import { Button } from '@/frontend/components/ui/Button'
import { Modal } from '@/frontend/components/ui/Modal'

interface BlogPreviewProps {
  post: BlogPost | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (post: BlogPost) => void
}

export function BlogPreview({ post, isOpen, onClose, onEdit }: BlogPreviewProps) {
  if (!post) return null

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium mb-2 text-gray-900 dark:text-white">{line.slice(4)}</h3>
        }
        
        // Bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />
        }
        
        // Regular paragraphs
        return (
          <p 
            key={index} 
            className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: boldText }}
          />
        )
      })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Blog Post Preview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preview how this post will appear to readers
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(post)}
                className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Post
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <article className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
                <span>By {post.author.username}</span>
              </div>
              <span>•</span>
              <span>{formatDate(new Date(post.createdAt))}</span>
              {post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated {formatDate(new Date(post.updatedAt))}</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Content */}
            <div className="text-gray-800 dark:text-gray-200">
              {renderContent(post.content)}
            </div>
          </article>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Post ID: {post.id}
            </div>
            <div className="flex items-center gap-3">
              {onEdit && (
                <Button
                  onClick={() => onEdit(post)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Edit This Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}