// components/admin/media/MediaPicker.tsx
'use client'

import { CalendarDays, Check, Folder, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MediaGrid } from './MediaGrid'
import { MediaList } from './MediaList'
import { MediaToolbar } from './MediaToolbar'
import type { MediaItem } from './useMediaLibrary'
import { MediaLibraryProvider, useMediaLibrary } from './useMediaLibrary'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (item: MediaItem) => void
  title?: string
  folder?: string
}

const PICKER_SKELETON_KEYS = Array.from({ length: 8 }, (_, index) => `picker-skeleton-${index}`)

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
  folder,
}: MediaPickerProps) {
  const [localOpen, setLocalOpen] = useState(isOpen)
  const [isMounted, setIsMounted] = useState(false)
  const [themeClassNames, setThemeClassNames] = useState('')
  const [themeDataTheme, setThemeDataTheme] = useState<string | null>(null)
  const [themeStyleText, setThemeStyleText] = useState<string | null>(null)
  const portalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setLocalOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !localOpen || typeof document === 'undefined') return
    const host = document.querySelector('.admin-scope') as HTMLElement | null
    if (!host) return
    const classes = Array.from(host.classList).filter(
      (item) => ['dark'].includes(item) || item.startsWith('theme-'),
    )
    setThemeClassNames(classes.join(' '))
    setThemeDataTheme(host.getAttribute('data-theme'))
    setThemeStyleText(host.getAttribute('style'))
  }, [isMounted, localOpen])

  useEffect(() => {
    if (!portalRef.current) return
    const styleValue = themeStyleText ?? ''
    if (styleValue) {
      portalRef.current.setAttribute('style', styleValue)
    } else {
      portalRef.current.removeAttribute('style')
    }
  }, [themeStyleText])

  useEffect(() => {
    if (!isMounted) return
    if (!localOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isMounted, localOpen])

  if (!localOpen || !isMounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={(node) => {
        portalRef.current = node
      }}
      className={themeClassNames}
      data-theme={themeDataTheme ?? undefined}
    >
      <MediaLibraryProvider initialFolder={folder ?? ''}>
        <MediaPickerModalShell
          title={title}
          folder={folder}
          onClose={() => {
            setLocalOpen(false)
            onClose()
          }}
          onSelect={(item) => {
            onSelect(item)
            setLocalOpen(false)
            onClose()
          }}
        />
      </MediaLibraryProvider>
    </div>,
    document.body,
  )
}

interface MediaPickerModalShellProps {
  title: string
  folder?: string
  onClose: () => void
  onSelect: (item: MediaItem) => void
}

function MediaPickerModalShell({ title, folder, onClose, onSelect }: MediaPickerModalShellProps) {
  const {
    items,
    loading,
    filters,
    setPage,
    page,
    totalPages,
    total,
    setFolder,
    uploading,
    selectedKey,
    setSelected,
  } = useMediaLibrary()

  useEffect(() => {
    if (folder && folder !== filters.folder) {
      setFolder(folder)
    } else if (!folder && filters.folder) {
      setFolder('')
    }
  }, [folder, filters.folder, setFolder])

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selectedKey) ?? null,
    [items, selectedKey],
  )

  const isEmpty = !loading && items.length === 0

  const confirmSelection = (item?: MediaItem) => {
    const target = item ?? selectedItem
    if (!target) return
    onSelect(target)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-8">
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur"
        onClick={onClose}
        aria-label="Close media picker"
      />
      <div className="relative w-full max-w-[1200px] rounded-3xl border theme-border bg-white shadow-2xl dark:bg-slate-950">
        <div className="flex h-[88vh] flex-col overflow-hidden rounded-3xl">
          <header className="flex items-center justify-between border-b theme-border px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold theme-text">{title}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {total} assets • Page {page} of {totalPages}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border theme-border text-neutral-500 transition hover:bg-theme-bg-secondary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col border-b theme-border lg:border-b-0 lg:border-r">
              <div className="border-b theme-border px-4 py-4 sm:px-6">
                <MediaToolbar allowFolderManagement allowUpload showSortControls showViewToggle />
              </div>

              <div className="flex-1 overflow-auto px-4 py-5 sm:px-6">
                {loading && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {PICKER_SKELETON_KEYS.map((key) => (
                      <div
                        key={key}
                        className="aspect-square rounded-2xl border theme-border bg-theme-bg-secondary/80 animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {isEmpty && (
                  <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border theme-border bg-theme-bg-secondary/60 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-3xl">
                      {uploading ? '⏳' : '📁'}
                    </div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      No media found in this view.
                    </p>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Try uploading new files or adjusting the filters.
                    </p>
                  </div>
                )}

                {!loading && items.length > 0 && (
                  <div className="space-y-4">
                    {filters.view === 'grid' ? (
                      <MediaGrid
                        showDeleteAction
                        onConfirmSelect={confirmSelection}
                        items={items}
                      />
                    ) : (
                      <MediaList
                        showDeleteAction
                        onConfirmSelect={confirmSelection}
                        items={items}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t theme-border px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  {uploading ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-blue-600 dark:text-blue-300">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-300">
                      Folder: {filters.folder || 'root'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage(page - 1)}
                    className="rounded-xl border theme-border px-3 py-2 text-sm font-medium transition hover:bg-theme-bg-secondary disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage(page + 1)}
                    className="rounded-xl border theme-border px-3 py-2 text-sm font-medium transition hover:bg-theme-bg-secondary disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <aside className="min-h-[240px] w-full border-t theme-border px-4 py-5 sm:px-6 lg:w-[320px] lg:border-t-0 lg:border-l">
              {selectedItem ? (
                <div className="flex h-full flex-col gap-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border theme-border bg-theme-bg-secondary">
                    {selectedItem.mimeType.startsWith('image/') ? (
                      <Image
                        src={selectedItem.url}
                        alt={selectedItem.alt || selectedItem.title || selectedItem.key}
                        fill
                        sizes="(max-width: 1024px) 50vw, 320px"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-300">
                        <Folder className="h-6 w-6" />
                        {selectedItem.mimeType}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border theme-border bg-theme-bg-secondary/70 p-4 text-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold theme-text">
                        {selectedItem.key}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                        {selectedItem.mimeType.split('/')[0]}
                      </span>
                    </div>

                    <dl className="space-y-2 text-neutral-600 dark:text-neutral-300">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                          <Folder className="h-3.5 w-3.5" /> Folder
                        </dt>
                        <dd className="truncate text-sm font-medium">
                          {selectedItem.folder || 'root'}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                          <Check className="h-3.5 w-3.5" /> Size
                        </dt>
                        <dd className="text-sm font-medium">{formatBytes(selectedItem.size)}</dd>
                      </div>
                      {selectedItem.createdAt && (
                        <div className="flex items-center justify-between gap-2">
                          <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            <CalendarDays className="h-3.5 w-3.5" /> Added
                          </dt>
                          <dd className="text-sm font-medium">
                            {formatDate(selectedItem.createdAt)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => confirmSelection()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-50"
                      disabled={!selectedItem}
                    >
                      Select file
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      disabled={!selectedItem}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border theme-border px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-theme-bg-secondary disabled:opacity-50 dark:text-neutral-300"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <Folder className="h-10 w-10" />
                  <p className="text-center text-sm font-medium">
                    Select an asset from the library to preview its details.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatBytes(size?: number | null) {
  if (!size || Number.isNaN(size)) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch (_error) {
    return value
  }
}
