'use client'

import { Filter, Folder, Layers, LayoutGrid, List as ListIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { MediaGrid } from './MediaGrid'
import { MediaList } from './MediaList'
import { MediaToolbar } from './MediaToolbar'
import { MediaLibraryProvider, useMediaLibrary } from './useMediaLibrary'

const GRID_SKELETON_KEYS = Array.from({ length: 12 }, (_, index) => `media-skeleton-${index}`)

export default function MediaPageContent() {
  const [introLoading, setIntroLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIntroLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  if (introLoading) {
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
    <MediaLibraryProvider>
      <MediaLibraryLayout />
    </MediaLibraryProvider>
  )
}

function MediaLibraryLayout() {
  const { items, loading, error, total, totalPages, page, setPage, filters, uploading } =
    useMediaLibrary()

  const isEmpty = !loading && items.length === 0

  const activeFilters = useMemo(() => {
    let count = 0
    if (filters.search.trim()) count += 1
    if (filters.folder) count += 1
    if (filters.sort !== 'newest') count += 1
    return count
  }, [filters.folder, filters.search, filters.sort])

  const stats = useMemo(
    () => [
      {
        label: 'Total assets',
        value: total,
        icon: Layers,
      },
      {
        label: 'Current folder',
        value: filters.folder ? `/${filters.folder}` : 'All media',
        icon: Folder,
      },
      {
        label: 'Active filters',
        value: activeFilters > 0 ? `${activeFilters}` : 'None',
        icon: Filter,
      },
      {
        label: 'View mode',
        value: filters.view === 'grid' ? 'Grid' : 'List',
        icon: filters.view === 'grid' ? LayoutGrid : ListIcon,
      },
    ],
    [activeFilters, filters.folder, filters.view, total],
  )

  return (
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-6 py-10">
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

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border theme-border bg-theme-bg-secondary/60 p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {label}
                </p>
                <p className="text-lg font-semibold theme-text">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border theme-border bg-theme-bg shadow-sm overflow-hidden">
          <div className="sticky top-[72px] z-20 border-b theme-border bg-theme-bg/85 backdrop-blur supports-[backdrop-filter]:bg-theme-bg/70 px-4 py-4 md:px-6 md:py-6">
            <MediaToolbar />
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {GRID_SKELETON_KEYS.map((key) => (
                  <div
                    key={key}
                    className="aspect-square rounded-2xl border theme-border bg-theme-bg-secondary/70 animate-pulse"
                  />
                ))}
              </div>
            )}

            {isEmpty && (
              <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border theme-border bg-theme-bg-secondary/70 shadow-inner">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 mb-4 flex items-center justify-center text-3xl">
                  {uploading ? '⏳' : '📁'}
                </div>
                <h3 className="text-lg font-semibold theme-text">No media found</h3>
                <p className="text-sm theme-text-secondary mt-1 max-w-md">
                  Adjust the search filters or upload new files to populate this view. All uploaded
                  media will appear here instantly.
                </p>
              </div>
            )}

            {!loading && items.length > 0 && (
              <div className="space-y-4">
                {filters.view === 'grid' ? <MediaGrid /> : <MediaList />}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
              <div className="text-sm theme-text-secondary">
                Page {page} of {totalPages} • {total} items
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(page + 1)}
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
