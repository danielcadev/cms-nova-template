'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { MediaGrid } from './MediaGrid'
import { MediaList } from './MediaList'
import { MediaToolbar } from './MediaToolbar'
import { MediaLibraryProvider, useMediaLibrary } from './useMediaLibrary'

const GRID_SKELETON_KEYS = Array.from({ length: 12 }, (_, index) => `media-skeleton-${index}`)

export default function MediaPageContent() {
  const [introLoading, setIntroLoading] = useState(true)
  const t = useTranslations('media')

  useEffect(() => {
    const timer = setTimeout(() => setIntroLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  if (introLoading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title={t('title')}
          message={t('loading')}
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
  const t = useTranslations('media')

  const isEmpty = !loading && items.length === 0

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
            {t('title')}
            <span className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
              {total}
            </span>
          </h1>
          <p className="text-zinc-500 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-3xl bg-white border border-zinc-100 shadow-xl shadow-zinc-200/40 overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 border-b border-zinc-100 bg-white/80 backdrop-blur-md p-4">
          <MediaToolbar />
        </div>

        <div className="flex-1 p-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl mb-6">{error}</div>
          )}

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {GRID_SKELETON_KEYS.map((key) => (
                <div key={key} className="aspect-square rounded-2xl bg-zinc-100 animate-pulse" />
              ))}
            </div>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center justify-center text-center h-full py-20">
              <div className="w-20 h-20 rounded-full bg-zinc-50 mb-6 flex items-center justify-center text-4xl shadow-sm">
                {uploading ? '⏳' : '📁'}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">{t('empty.title')}</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                {t('empty.description')}
              </p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-6">
              {filters.view === 'grid' ? <MediaGrid /> : <MediaList />}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-zinc-100 p-4 bg-zinc-50/50 flex items-center justify-between">
          <div className="text-sm text-zinc-500 font-medium">
            {t('pagination.page', { current: page, total: totalPages })} • {t('pagination.items', { count: total })}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {t('pagination.previous')}
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
