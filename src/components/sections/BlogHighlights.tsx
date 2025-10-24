"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Mock blog data - in a real app, this would come from your API/database
const mockBlogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 14 App Router",
    excerpt: "Learn how to build modern web applications with the new App Router architecture in Next.js 14.",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Tutorial",
    image: "/api/placeholder/400/250"
  },
  {
    id: "2", 
    title: "TypeScript Best Practices for React Development",
    excerpt: "Discover essential TypeScript patterns and practices that will make your React code more robust and maintainable.",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Best Practices",
    image: "/api/placeholder/400/250"
  },
  {
    id: "3",
    title: "Building Responsive UIs with Tailwind CSS",
    excerpt: "Master the art of creating beautiful, responsive user interfaces using Tailwind CSS utility classes.",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Design",
    image: "/api/placeholder/400/250"
  }
];

export function BlogHighlights() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Latest from Our{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Blog
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover insights, tutorials, and best practices for modern web development
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockBlogPosts.map((post, index) => (
            <article
              key={post.id}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-xs font-medium text-gray-900 dark:text-gray-100 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  <Link href={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                >
                  Read more
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" variant="outline" className="group">
              View All Posts
              <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}