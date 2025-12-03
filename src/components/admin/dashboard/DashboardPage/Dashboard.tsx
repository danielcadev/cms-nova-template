'use client'

import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, FileText, Image as ImageIcon, Settings, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useUsers } from '@/hooks/use-users'
import { usePlans } from '@/hooks/usePlans'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const { user } = useCurrentUser()
  const { plans, isLoading: plansLoading } = usePlans()
  const { users, loading: usersLoading } = useUsers()

  const userName = user?.name || 'Administrator'
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  const isLoading = plansLoading || usersLoading

  const activities = useMemo(() => {
    const allActivities = [
      ...plans.map((plan) => ({
        id: `plan-${plan.id}`,
        text: `New plan "${plan.mainTitle}" created`,
        date: new Date(plan.createdAt),
        color: 'bg-emerald-500',
        icon: FileText,
      })),
      ...users.map((user) => ({
        id: `user-${user.id}`,
        text: `New user ${user.name || user.email} registered`,
        date: new Date(user.createdAt),
        color: 'bg-purple-500',
        icon: UserPlus,
      })),
    ]

    return allActivities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)
      .map((activity) => ({
        ...activity,
        time: formatDistanceToNow(activity.date, { addSuffix: true, locale: es }),
      }))
  }, [plans, users])

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <AdminLoading
          title="Dashboard"
          message="Preparing dashboard..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="text-zinc-500">Overview of your workspace</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-600">System Online</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[180px]">
        {/* Welcome Widget (Large) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 relative overflow-hidden rounded-3xl bg-zinc-900 p-8 text-white shadow-2xl shadow-zinc-900/20 group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 mb-6">
                v4.1.1 Stable
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {greeting}, <br />
                <span className="text-zinc-400">{userName}</span>
              </h2>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/dashboard/view-content">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors"
                >
                  Create Content
                </button>
              </Link>
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                View Analytics
              </button>
            </div>
          </div>

          {/* Abstract Decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-500 to-teal-500 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        </div>

        {/* Activity Feed (Tall - Right Side) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-3 rounded-3xl bg-white p-6 border border-zinc-100 shadow-xl shadow-zinc-200/40 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Activity</h3>
            <button
              type="button"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-none">
            {activities.length > 0 ? (
              activities.map((item) => (
                <div key={item.id} className="flex gap-3 items-start group">
                  <div
                    className={cn(
                      'h-2 w-2 mt-2 rounded-full shrink-0 ring-2 ring-white',
                      item.color,
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                      {item.text}
                    </p>
                    <p className="text-xs text-zinc-400">{item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <Calendar className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (Wide) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 rounded-3xl bg-white p-6 border border-zinc-100 shadow-xl shadow-zinc-200/40 flex items-center justify-between gap-6">
          <Link href="/admin/dashboard/media" className="flex-1 group h-full">
            <div className="h-full rounded-2xl bg-zinc-50 p-4 hover:bg-zinc-100 transition-colors border border-zinc-100 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-white shadow-sm text-zinc-400 group-hover:text-purple-600 transition-colors">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900">
                Media Library
              </span>
            </div>
          </Link>
          <Link href="/admin/dashboard/settings" className="flex-1 group h-full">
            <div className="h-full rounded-2xl bg-zinc-50 p-4 hover:bg-zinc-100 transition-colors border border-zinc-100 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-white shadow-sm text-zinc-400 group-hover:text-zinc-900 transition-colors">
                <Settings className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900">
                Settings
              </span>
            </div>
          </Link>
          <Link href="/admin/dashboard/users" className="flex-1 group h-full">
            <div className="h-full rounded-2xl bg-zinc-50 p-4 hover:bg-zinc-100 transition-colors border border-zinc-100 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-white shadow-sm text-zinc-400 group-hover:text-emerald-600 transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900">
                Team Members
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
