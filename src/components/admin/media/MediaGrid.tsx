// components/admin/media/MediaGrid.tsx
'use client'

import { Copy, Download, Eye, Link2, type LucideIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { type MouseEvent, useCallback, useMemo, useState } from 'react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { useConfirmation } from '@/hooks/useConfirmation'
import type { MediaItem } from './useMediaLibrary'
import { useMediaLibrary } from './useMediaLibrary'

interface MediaGridProps {
  items?: MediaItem[]
  onSelect?: (item: MediaItem) => void
  onDeleted?: () => void
  showDeleteAction?: boolean
  emptyLabel?: string
  onConfirmSelect?: (item: MediaItem) => void
}

export function MediaGrid({
  items: itemsProp,
  onSelect,
  onDeleted,
  showDeleteAction = true,
  emptyLabel = 'No media found',
  onConfirmSelect,
}: MediaGridProps) {
  const { items: contextItems, deleteItem, deleting, setSelected, selectedKey } = useMediaLibrary()

  const items = useMemo(() => itemsProp ?? contextItems, [itemsProp, contextItems])
  const [preview, setPreview] = useState<MediaItem | null>(null)
  const confirmation = useConfirmation()

  const handleDelete = (event: MouseEvent<HTMLElement>, key: string) => {
    event.preventDefault()
    event.stopPropagation()

    confirmation.confirm(
      {
        title: 'Delete file',
        description:
          'Are you sure you want to delete this file from S3 and the media library? This action cannot be undone.',
        confirmText: 'Delete file',
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        await deleteItem(key)
        onDeleted?.()
      },
    )
  }

  const handleCopy = (event: MouseEvent<HTMLElement>, item: MediaItem) => {
    event.preventDefault()
    event.stopPropagation()
    navigator.clipboard
      .writeText(item.url)
      .then(() => toast.success({ title: 'Link copied', description: item.key }))
      .catch(() => toast.error({ title: 'Copy failed', description: 'Could not copy link' }))
  }

  const handleDownload = (event: MouseEvent<HTMLElement>, item: MediaItem) => {
    event.preventDefault()
    event.stopPropagation()
    const link = document.createElement('a')
    link.href = item.url
    link.download = item.key.split('/').pop() ?? item.key
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openPreview = (event: MouseEvent<HTMLElement>, item: MediaItem) => {
    event.preventDefault()
    event.stopPropagation()
    setPreview(item)
  }

  const selectItem = (item: MediaItem) => {
    setSelected(item.key)
    onSelect?.(item)
  }

  const confirmOrPreview = useCallback(
    (item: MediaItem) => {
      if (onConfirmSelect) {
        onConfirmSelect(item)
      } else {
        setPreview(item)
      }
    },
    [onConfirmSelect],
  )

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border theme-border bg-theme-bg-secondary/60 py-16 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-3xl">
          📁
        </div>
        <p className="text-sm font-medium theme-text-secondary">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((item) => {
          const isImage = item.mimeType.startsWith('image/')
          const fileName = item.key.split('/').pop() ?? item.key
          const fileFolder =
            item.folder ||
            (item.key.includes('/') ? item.key.split('/').slice(0, -1).join('/') : 'root')
          const fileType = item.mimeType.split('/')[0]
          const isSelected = selectedKey === item.key

          return (
            <div
              key={item.key}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'border-blue-400/80 bg-blue-50/40 shadow-lg shadow-blue-200/60 dark:border-blue-500/50 dark:bg-blue-500/10 dark:shadow-blue-900/40'
                  : 'theme-border theme-card shadow-sm hover:shadow-md'
              }`}
            >
              <div className="relative aspect-square overflow-hidden">
                {isImage ? (
                  <Image
                    src={item.url}
                    alt={item.alt || item.title || item.key}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-bg-secondary/80 to-theme-bg-secondary text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
                    {item.mimeType}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => selectItem(item)}
                  onDoubleClick={() => {
                    selectItem(item)
                    confirmOrPreview(item)
                  }}
                  className="absolute inset-0 z-10 block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                  aria-label={`Select ${item.key}`}
                >
                  <span className="sr-only">Select {item.key}</span>
                </button>

                <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                  <div className="flex items-start justify-between p-3">
                    <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] uppercase tracking-wider text-white/85">
                      {fileType}
                    </span>
                    {showDeleteAction && (
                      <ActionButton
                        icon={Trash2}
                        label="Delete file"
                        disabled={deleting}
                        onClick={(event) => handleDelete(event, item.key)}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3 text-white">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{fileName}</p>
                      <p className="text-xs text-white/80">{fileFolder || 'root'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase">
                      {formatBytes(item.size)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-medium theme-text">{fileName}</p>
                  <p className="truncate text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    {fileType} • {formatBytes(item.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <ActionButton
                    icon={Eye}
                    label="Preview"
                    onClick={(event) => openPreview(event, item)}
                  />
                  <ActionButton
                    icon={Copy}
                    label="Copy URL"
                    onClick={(event) => handleCopy(event, item)}
                  />
                  <ActionButton
                    icon={Download}
                    label="Download"
                    onClick={(event) => handleDownload(event, item)}
                  />
                  <ActionButton
                    icon={Link2}
                    label="Open in new tab"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      window.open(item.url, '_blank', 'noopener,noreferrer')
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-4xl">
          {preview && (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="truncate text-lg font-semibold">{preview.key}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-5 md:grid-cols-[minmax(0,3fr)_2fr]">
                <div className="relative flex aspect-square items-center justify-center rounded-2xl border theme-border bg-theme-bg-secondary">
                  {preview.mimeType.startsWith('image/') ? (
                    <Image
                      src={preview.url}
                      alt={preview.alt || preview.title || preview.key}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
                      {preview.mimeType}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border theme-border bg-theme-bg-secondary/60 p-4 text-sm">
                    <dl className="space-y-2">
                      <div className="flex justify-between gap-3">
                        <dt className="text-neutral-500 dark:text-neutral-400">Type</dt>
                        <dd className="font-medium theme-text">{preview.mimeType}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-neutral-500 dark:text-neutral-400">Size</dt>
                        <dd className="font-medium theme-text">{formatBytes(preview.size)}</dd>
                      </div>
                      {preview.width && preview.height && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-neutral-500 dark:text-neutral-400">Dimensions</dt>
                          <dd className="font-medium theme-text">
                            {preview.width} × {preview.height} px
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3">
                        <dt className="text-neutral-500 dark:text-neutral-400">Folder</dt>
                        <dd className="font-medium theme-text">{preview.folder || 'root'}</dd>
                      </div>
                      {preview.createdAt && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-neutral-500 dark:text-neutral-400">Uploaded</dt>
                          <dd className="font-medium theme-text">
                            {formatDate(preview.createdAt)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(event) => handleDownload(event, preview)}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                    >
                      <Download className="h-4 w-4" /> Save file
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleCopy(event, preview)}
                      className="inline-flex items-center gap-2 rounded-xl border theme-border px-4 py-2 text-sm font-medium theme-text transition hover:bg-theme-bg-secondary"
                    >
                      <Copy className="h-4 w-4" /> Copy link
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        window.open(preview.url, '_blank', 'noopener,noreferrer')
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border theme-border px-4 py-2 text-sm font-medium theme-text transition hover:bg-theme-bg-secondary"
                    >
                      <Link2 className="h-4 w-4" /> Open in new tab
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {confirmation.config && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.handleConfirm}
          config={confirmation.config}
        />
      )}
    </>
  )
}

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

function ActionButton({ icon: Icon, label, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="pointer-events-auto rounded-full border border-white/60 bg-white/80 p-1.5 text-neutral-600 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 dark:border-white/20 dark:bg-white/10 dark:text-white"
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
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
