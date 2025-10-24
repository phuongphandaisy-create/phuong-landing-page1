'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPost, BlogFormData } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface BlogEditorProps {
  initialData?: BlogPost
  onSave: (data: BlogFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function BlogEditor({ initialData, onSave, onCancel, isLoading = false }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || ''
  })
  
  const [errors, setErrors] = useState<Partial<BlogFormData>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<BlogFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Auto-save functionality (every 30 seconds if there are changes)
  useEffect(() => {
    if (!hasChanges || !initialData) return

    const autoSaveInterval = setInterval(() => {
      if (validateForm()) {
        onSave(formData).catch(console.error)
        setHasChanges(false)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [formData, hasChanges, initialData, onSave, validateForm])

  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      await onSave(formData)
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  // Simple markdown-like preview rendering
  const renderPreview = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mb-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium mb-2">{line.slice(4)}</h3>
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
            className="mb-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldText }}
          />
        )
      })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {initialData ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Unsaved changes
            </span>
          )}
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || Object.keys(errors).length > 0}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isLoading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="Enter blog post title..."
              required
            />
          </div>
          <div>
            <Input
              label="Excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              error={errors.excerpt}
              placeholder="Brief description of the post..."
              required
            />
          </div>
        </div>
      </div>

      {/* Side-by-side Editor and Preview */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Editor</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use markdown syntax for formatting
            </p>
          </div>
          <div className="flex-1 p-4">
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your blog post content here... 

Use markdown syntax:
# Heading 1
## Heading 2
### Heading 3
**Bold text**

Regular paragraphs..."
              className="w-full h-full resize-none border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.content}
              </p>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Live Preview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See how your post will look
            </p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {formData.title && (
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  {formData.title}
                </h1>
              )}
              {formData.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
                  {formData.excerpt}
                </p>
              )}
              <div className="text-gray-800 dark:text-gray-200">
                {formData.content ? (
                  renderPreview(formData.content)
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    Start typing to see the preview...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}