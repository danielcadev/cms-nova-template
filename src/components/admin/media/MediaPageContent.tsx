'use client'

import { useEffect, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { MediaGrid } from './MediaGrid'
import { MediaToolbar } from './MediaToolbar'
import { useMediaLibrary } from './useMediaLibrary'

export default function MediaPageContent() {
  const [loading, setLoading] = useState(true)
  const lib = useMediaLibrary()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title="Media"
          message="Loading media library..."
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
          <div className="relative p-6 sm:p-8 md:p-10">
            <div>
              <p className="text-sm theme-text-muted mb-2">Assets</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Media Library
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Manage your images, videos, and other media assets.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border theme-border theme-card p-0 overflow-hidden">
          {/* Sticky toolbar */}
          <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border-b theme-border p-4">
            <MediaToolbar
              q={lib.q}
              onSearch={lib.search}
              folders={lib.folders}
              folder={lib.folder}
              onFolder={lib.changeFolder}
              onUpload={(files) => lib.upload(files)}
              sort={lib.sort}
              setSort={lib.setSort}
              view={lib.view}
              setView={lib.setView}
            />
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {lib.error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{lib.error}</div>
            )}

            {/* Loading skeleton when changing filters/pagination */}
            {lib.loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }, () => (
                  <div
                    key={crypto.randomUUID()}
                    className="aspect-square rounded-lg border theme-border theme-bg-secondary animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!lib.loading && lib.items.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16 rounded-xl border theme-border theme-bg-secondary">
                <div className="w-16 h-16 rounded-full theme-bg mb-4 flex items-center justify-center border theme-border">
                  📁
                </div>
                <h3 className="text-lg font-medium theme-text">No media found</h3>
                <p className="text-sm theme-text-secondary mt-1">
                  Try changing filters or upload new files to this folder.
                </p>
                <div className="mt-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover cursor-pointer w-fit">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && lib.upload(e.target.files)}
                    />
                    <span className="text-sm theme-text">Upload files</span>
                  </label>
                </div>
              </div>
            )}

            {/* Grid */}
            {!lib.loading && lib.items.length > 0 && (
              <MediaGrid
                items={lib.items}
                onDeleted={() => lib.fetchItems({ page: lib.page, q: lib.q, folder: lib.folder })}
              />
            )}

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
              <div className="text-sm theme-text-secondary">
                Page {lib.page} of {lib.totalPages} • {lib.total} items
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={lib.page <= 1 || lib.loading}
                  onClick={() => lib.setPage(lib.page - 1)}
                  className="px-3 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={lib.page >= lib.totalPages || lib.loading}
                  onClick={() => lib.setPage(lib.page + 1)}
                  className="px-3 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
