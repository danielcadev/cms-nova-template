'use client'

import { useEffect, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'

export default function TemplatesPageContent() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Small delay to ensure loader is visible and avoid flash
    const t = setTimeout(() => setLoading(false), 250)
    return () => clearTimeout(t)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title="Templates"
          message="Loading templates..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Cover Header */}
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div>
              <p className="text-sm theme-text-muted mb-2">Design</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Plan Templates
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Create and manage templates for your tourism plans.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border theme-border theme-card p-8 text-center">
          <div className="mx-auto max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full theme-bg-secondary flex items-center justify-center">
              <svg
                className="w-8 h-8 theme-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Plan Templates</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold theme-text mb-2">Plan Templates Coming Soon</h3>
            <p className="theme-text-secondary">
              Template management for tourism plans is currently under development. You'll be able
              to create, edit, and organize your plan templates here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
