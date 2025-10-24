"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { BlogHighlights } from "@/components/sections/BlogHighlights";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Blog Highlights Section */}
      <BlogHighlights />

      {/* Quick Links Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover all the features and pages available in our modern landing page
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/about" className="group">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn more about our project, mission, and the technology stack behind this modern landing page.
                </p>
              </div>
            </Link>
            
            <Link href="/blog" className="group">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Blog
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Read our latest articles, tutorials, and insights about web development and modern technologies.
                </p>
              </div>
            </Link>
            
            <Link href="/contact" className="group">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Contact
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get in touch with us. We&apos;d love to hear from you and answer any questions you might have.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}