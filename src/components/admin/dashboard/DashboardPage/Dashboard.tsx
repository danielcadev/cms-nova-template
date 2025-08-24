'use client'

import { ChevronRight, Database, FileText, Layout, Plus, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'

export function Dashboard() {
  const { user } = useCurrentUser()
  const userName = user?.name || 'Administrator'
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Cover Header (match Templates/Plugins) */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div>
              <p className="text-sm theme-text-muted mb-2">Overview</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                {greeting}, {userName}
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Manage your content with a clean, minimal workspace.
              </p>
            </div>
            <Link href="/admin/dashboard/templates/tourism/create">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border theme-border theme-card theme-text hover:theme-card-hover transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                New content
              </button>
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold theme-text">Quick actions</h2>
          <div className="divide-y theme-border rounded-lg border theme-border overflow-hidden theme-card shadow-sm">
            <Link href="/admin/dashboard/users" className="group block">
              <div className="flex items-center justify-between p-4 hover:theme-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg theme-bg-secondary flex items-center justify-center">
                    <Users className="h-4 w-4 theme-text" />
                  </div>
                  <div>
                    <div className="text-sm font-medium theme-text">User management</div>
                    <div className="text-xs theme-text-secondary">Manage users and permissions</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 theme-text-muted group-hover:theme-text-secondary" />
              </div>
            </Link>

            <Link href="/admin/dashboard/view-content" className="group block">
              <div className="flex items-center justify-between p-4 hover:theme-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg theme-bg-secondary flex items-center justify-center">
                    <FileText className="h-4 w-4 theme-text" />
                  </div>
                  <div>
                    <div className="text-sm font-medium theme-text">View content</div>
                    <div className="text-xs theme-text-secondary">Review and manage content</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 theme-text-muted group-hover:theme-text-secondary" />
              </div>
            </Link>

            <Link href="/admin/dashboard/templates" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:theme-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg theme-bg-secondary flex items-center justify-center">
                    <Layout className="h-4 w-4 theme-text" />
                  </div>
                  <div>
                    <div className="text-sm font-medium theme-text">Templates</div>
                    <div className="text-xs theme-text-secondary">Manage content templates</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 theme-text-muted group-hover:theme-text-secondary" />
              </div>
            </Link>

            <Link href="/admin/dashboard/content-types" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:theme-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg theme-bg-secondary flex items-center justify-center">
                    <Database className="h-4 w-4 theme-text" />
                  </div>
                  <div>
                    <div className="text-sm font-medium theme-text">Content types</div>
                    <div className="text-xs theme-text-secondary">Configure data structures</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 theme-text-muted group-hover:theme-text-secondary" />
              </div>
            </Link>

            <Link href="/admin/dashboard/plugins" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:theme-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg theme-bg-secondary flex items-center justify-center">
                    <Plus className="h-4 w-4 theme-text" />
                  </div>
                  <div>
                    <div className="text-sm font-medium theme-text">Plugins</div>
                    <div className="text-xs theme-text-secondary">Extend your CMS</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 theme-text-muted group-hover:theme-text-secondary" />
              </div>
            </Link>

            <Link href="/admin/dashboard/settings" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:theme-card-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg theme-bg-secondary flex items-center justify-center">
                    <Settings className="h-4 w-4 theme-text" />
                  </div>
                  <div>
                    <div className="text-sm font-medium theme-text">Settings</div>
                    <div className="text-xs theme-text-secondary">System preferences</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 theme-text-muted group-hover:theme-text-secondary" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
