"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Access denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {session.user.username}!
              </p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Blog Management</h3>
              <p className="text-indigo-100 mb-4">
                Create, edit, and manage your blog posts
              </p>
              <Button
                variant="secondary"
                onClick={() => window.location.href = "/admin/blog"}
              >
                Manage Blog
              </Button>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Contact Submissions</h3>
              <p className="text-green-100 mb-4">
                View and manage contact form submissions
              </p>
              <Button
                variant="secondary"
                disabled
              >
                Coming Soon
              </Button>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-orange-100 mb-4">
                View website analytics and statistics
              </p>
              <Button
                variant="secondary"
                disabled
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}