'use client'

import { Database } from 'lucide-react'

export function ContentTypesLoadingState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
      <div className="animate-pulse space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-200">
            <Database className="h-8 w-8 text-zinc-300" />
          </div>
          <div className="h-5 bg-zinc-100 rounded-lg w-48 mx-auto mb-3"></div>
          <div className="h-4 bg-zinc-50 rounded-lg w-32 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-50 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-zinc-50 rounded w-full"></div>
                <div className="h-3 bg-zinc-50 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
