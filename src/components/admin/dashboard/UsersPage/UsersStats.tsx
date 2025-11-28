'use client'

import { ArrowUpRight, Calendar, Crown, Shield, TrendingUp, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UsersStatsProps {
  stats: {
    total: number
    admins: number
    verified: number
    newThisMonth: number
  }
}

export function UsersStats({ stats }: UsersStatsProps) {
  const activityBars = Array.from({ length: 20 }, (_, i) => ({
    id: `activity-${i}`,
    index: i,
  }))

  return (
    <div className="px-6 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[180px]">
          {/* Hero Card - Total Users (Span 2 cols, 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-10 text-white shadow-2xl shadow-zinc-900/30 group">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 mb-4 text-zinc-300">
                    <Zap className="w-3 h-3 mr-1.5 text-yellow-400" />
                    Live Metrics
                  </div>
                  <h2 className="text-7xl font-bold tracking-tighter mb-2">{stats.total}</h2>
                  <p className="text-zinc-400 font-medium text-lg">Total Registered Users</p>
                </div>
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">+12% Growth</span>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium">vs. last month</p>
                </div>

                {/* Simulated Activity Bar */}
                <div className="flex gap-1 h-2 w-full max-w-sm opacity-50">
                  {activityBars.map((bar) => (
                    <div
                      key={bar.id}
                      className={cn(
                        'flex-1 rounded-full',
                        bar.index > 14 ? 'bg-zinc-700' : 'bg-white',
                      )}
                      style={{ opacity: bar.index > 14 ? 0.3 : 1 - bar.index * 0.02 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Abstract Background Blobs */}
            <div className="absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-blue-600/30 blur-[100px] group-hover:bg-blue-600/40 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-80 w-80 rounded-full bg-purple-600/30 blur-[100px] group-hover:bg-purple-600/40 transition-colors duration-700" />
          </div>

          {/* New Users Card (Span 1 col, 1 row) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 border border-zinc-100 shadow-xl shadow-zinc-200/40 group hover:border-blue-200 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-24 h-24 text-blue-600 -mr-8 -mt-8" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  New
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 tracking-tight">
                  {stats.newThisMonth}
                </p>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>This Month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admins Card (Span 1 col, 1 row) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50 to-white p-6 border border-orange-100/50 shadow-xl shadow-orange-500/5 group hover:shadow-orange-500/10 transition-all duration-300">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Crown className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 tracking-tight">{stats.admins}</p>
                <p className="text-sm font-medium text-zinc-500 mt-1">Administrators</p>
              </div>
            </div>
          </div>

          {/* Verified Card (Span 1 col, 1 row) - Only visible on larger screens or if we add another row */}
          <div className="md:col-start-3 md:row-start-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 to-white p-6 border border-emerald-100/50 shadow-xl shadow-emerald-500/5 group hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 tracking-tight">{stats.verified}</p>
                <p className="text-sm font-medium text-zinc-500 mt-1">Verified Accounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
