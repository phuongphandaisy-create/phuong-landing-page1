'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setResult({ type: 'health', data })
    } catch (error) {
      setResult({ type: 'error', data: error.message })
    } finally {
      setLoading(false)
    }
  }

  const resetAdmin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/reset-admin', { method: 'POST' })
      const data = await response.json()
      setResult({ type: 'reset', data })
    } catch (error) {
      setResult({ type: 'error', data: error.message })
    } finally {
      setLoading(false)
    }
  }

  const initDb = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/init-db', { method: 'POST' })
      const data = await response.json()
      setResult({ type: 'init', data })
    } catch (error) {
      setResult({ type: 'error', data: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Production Debug Panel
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={checkHealth}
            disabled={loading}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Check System Health
          </button>
          
          <button
            onClick={resetAdmin}
            disabled={loading}
            className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Reset Admin Password
          </button>
          
          <button
            onClick={initDb}
            disabled={loading}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Initialize Database
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {result.type} Result
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Environment Info
          </h3>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">
            <p><strong>Expected Admin Credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: {process.env.NODE_ENV === 'production' ? '[Check ADMIN_PASSWORD env var]' : 'admin123'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}