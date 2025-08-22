'use client'

import { ChevronRight, Database, FileText, Layout, Plus, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'
import { adminService, type UserStats } from '@/services/admin/user/adminService'
import { AdminLoading } from '../AdminLoading'

export function Dashboard() {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    growthRate: 0,
    activeUsers: 0,
    activeSessionsCount: 0,
    newUsersThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user, isLoading: userLoading } = useCurrentUser()

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const userStats = await adminService.getUserStats()
        setStats(userStats)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Could not load statistics'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })

        setStats({
          total: 5,
          growthRate: 20,
          activeUsers: 3,
          activeSessionsCount: 2,
          newUsersThisMonth: 1,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [toast])

  const userName = user?.name || 'Administrator'
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="relative">
        <AdminLoading
          title="Dashboard"
          message="Loading your workspace..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {greeting}, {userName}
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your content with a clean, minimal workspace.
              </p>
            </div>
            <Link href="/admin/dashboard/templates/tourism/create">
              <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                New content
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total users', value: stats.total },
            { label: 'Growth', value: `${stats.growthRate}%` },
            { label: 'Active sessions', value: stats.activeSessionsCount },
            { label: 'New this month', value: stats.newUsersThisMonth },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div className="text-sm font-medium text-gray-500">{label}</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Quick actions
          </h2>
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
            <Link href="/admin/dashboard/users" className="group block">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      User management
                    </div>
                    <div className="text-xs text-gray-500">
                      Manage users and permissions
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>

            <Link href="/admin/dashboard/view-content" className="group block">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      View content
                    </div>
                    <div className="text-xs text-gray-500">
                      Review and manage content
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>

            <Link href="/admin/dashboard/templates" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Layout className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Templates
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Manage content templates
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
            </Link>

            <Link href="/admin/dashboard/content-types" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Database className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Content types
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Configure data structures
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
            </Link>

            <Link href="/admin/dashboard/plugins" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Plugins
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Extend your CMS</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
            </Link>

            <Link href="/admin/dashboard/settings" className="group block">
              <div className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Settings
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      System preferences
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
