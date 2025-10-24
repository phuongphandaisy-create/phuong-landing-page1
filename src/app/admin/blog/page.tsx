'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BlogPost, BlogFormData } from '@/types'
import { BlogList } from '@/components/blog/BlogList'
import { BlogEditor } from '@/components/blog/BlogEditor'
import { BlogPreview } from '@/components/blog/BlogPreview'
import { Button } from '@/components/ui/Button'

type ViewMode = 'list' | 'editor' | 'preview'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
  }
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [currentView, setCurrentView] = useState<ViewMode>('list')
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/blog')
      const result: ApiResponse<BlogPost[]> = await response.json()
      
      if (result.success && result.data) {
        setPosts(result.data)
      } else {
        console.error('Failed to fetch posts:', result.error?.message)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session])

  // Create new blog post
  const handleCreatePost = async (formData: BlogFormData) => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: ApiResponse<BlogPost> = await response.json()
      
      if (result.success && result.data) {
        setPosts(prev => [result.data!, ...prev])
        setCurrentView('list')
        setEditingPost(null)
      } else {
        throw new Error(result.error?.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Update existing blog post
  const handleUpdatePost = async (formData: BlogFormData) => {
    if (!editingPost) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/blog/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: ApiResponse<BlogPost> = await response.json()
      
      if (result.success && result.data) {
        setPosts(prev => prev.map(post => 
          post.id === editingPost.id ? result.data! : post
        ))
        setCurrentView('list')
        setEditingPost(null)
      } else {
        throw new Error(result.error?.message || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete blog post
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
      })

      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setPosts(prev => prev.filter(post => post.id !== postId))
      } else {
        throw new Error(result.error?.message || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete blog post. Please try again.')
    }
  }

  // Handle edit post
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setCurrentView('editor')
    setPreviewPost(null)
  }

  // Handle preview post
  const handlePreviewPost = (post: BlogPost) => {
    setPreviewPost(post)
  }

  // Handle create new post
  const handleNewPost = () => {
    setEditingPost(null)
    setCurrentView('editor')
    setPreviewPost(null)
  }

  // Handle cancel editor
  const handleCancelEditor = () => {
    setCurrentView('list')
    setEditingPost(null)
  }

  // Handle save post
  const handleSavePost = async (formData: BlogFormData) => {
    if (editingPost) {
      await handleUpdatePost(formData)
    } else {
      await handleCreatePost(formData)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {currentView === 'list' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Blog Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <Button
              onClick={handleNewPost}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{posts.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Posts</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {posts.filter(post => {
                      const dayAgo = new Date()
                      dayAgo.setDate(dayAgo.getDate() - 7)
                      return new Date(post.createdAt) > dayAgo
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Author</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{session.user.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blog List */}
          <BlogList
            posts={posts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onPreview={handlePreviewPost}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="h-screen">
          <BlogEditor
            initialData={editingPost || undefined}
            onSave={handleSavePost}
            onCancel={handleCancelEditor}
            isLoading={isSaving}
          />
        </div>
      )}

      {/* Preview Modal */}
      <BlogPreview
        post={previewPost}
        isOpen={!!previewPost}
        onClose={() => setPreviewPost(null)}
        onEdit={handleEditPost}
      />
    </div>
  )
}