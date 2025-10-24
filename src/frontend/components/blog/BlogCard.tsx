import Link from 'next/link'
import { BlogPost } from '@/shared/types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Link href={`/blog/${post.id}`} className="block tap-highlight-none">
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-gray-200 dark:border-gray-700 overflow-hidden touch-target">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </span>
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              {post.author.username}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-active:text-indigo-700 dark:group-active:text-indigo-300 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-active:text-indigo-800 dark:group-active:text-indigo-200 transition-colors duration-200">
            Read more
            <svg 
              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 group-active:translate-x-2 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}