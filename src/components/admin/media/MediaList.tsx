// components/admin/media/MediaList.tsx
'use client'

import { Copy, Download, Eye, FileImage, FileText, Link2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { type MouseEvent, useMemo } from 'react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { toast } from '@/hooks/use-toast'
import { useConfirmation } from '@/hooks/useConfirmation'
import type { MediaItem } from './useMediaLibrary'
import { useMediaLibrary } from './useMediaLibrary'

interface MediaListProps {
  items?: MediaItem[]
  onSelect?: (item: MediaItem) => void
  onDeleted?: () => void
  showDeleteAction?: boolean
  emptyLabel?: string
  onConfirmSelect?: (item: MediaItem) => void
}

export function MediaList({
  items: itemsProp,
  onSelect,
  onDeleted,
  showDeleteAction = true,
  emptyLabel = 'No media found',
  onConfirmSelect,
}: MediaListProps) {
  const { items: contextItems, selectedKey, setSelected, deleteItem, deleting } = useMediaLibrary()

  const confirmation = useConfirmation()
  const items = useMemo(() => itemsProp ?? contextItems, [itemsProp, contextItems])

  const handleSelect = (item: MediaItem) => {
    setSelected(item.key)
    onSelect?.(item)
  }

  const handleDelete = (item: MediaItem) => {
    confirmation.confirm(
      {
        title: 'Delete file',
        description: `This will remove "${item.key}" permanently from storage and the media library. Continue?`,
        confirmText: 'Delete file',
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        await deleteItem(item.key)
        onDeleted?.()
      },
    )
  }

  const handleCopy = (event: MouseEvent<HTMLButtonElement>, item: MediaItem) => {
    event.preventDefault()
    event.stopPropagation()
    navigator.clipboard
      .writeText(item.url)
      .then(() => toast.success({ title: 'Link copied', description: item.key }))
      .catch(() => toast.error({ title: 'Copy failed', description: 'Could not copy link' }))
  }

  const handleDownload = (event: MouseEvent<HTMLButtonElement>, item: MediaItem) => {
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

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border theme-border bg-theme-bg-secondary/60 py-16 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-3xl">
          🗂️
        </div>
        <p className="text-sm font-medium theme-text-secondary">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border theme-border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-theme-bg-secondary/80 text-left uppercase tracking-wide text-xs text-neutral-500 dark:text-neutral-400">
          <tr>
            <th className="px-5 py-3 font-semibold">File</th>
            <th className="px-5 py-3 font-semibold">Details</th>
            <th className="px-5 py-3 font-semibold">Folder</th>
            <th className="px-5 py-3 font-semibold">Size</th>
            <th className="px-5 py-3 font-semibold">Created</th>
            <th className="px-5 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y theme-border text-sm">
          {items.map((item) => {
            const isSelected = selectedKey === item.key
            const fileName = item.key.split('/').pop() ?? item.key
            const fileType = item.mimeType.split('/')[0]

            return (
              <tr
                key={item.key}
                onClick={() => handleSelect(item)}
                onDoubleClick={() => onConfirmSelect?.(item)}
                className={`cursor-pointer transition ${
                  isSelected
                    ? 'bg-blue-50/80 shadow-inner dark:bg-blue-500/10'
                    : 'hover:bg-theme-bg-secondary/60'
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border theme-border">
                      {item.mimeType.startsWith('image/') ? (
                        <Image
                          src={item.url}
                          alt={item.alt || item.title || item.key}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-theme-bg-secondary/70">
                          {fileType === 'text' ? (
                            <FileText className="h-5 w-5 text-neutral-500" />
                          ) : (
                            <FileImage className="h-5 w-5 text-neutral-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold theme-text">{fileName}</p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {item.mimeType}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 align-middle text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="flex flex-col gap-1">
                    <span className="truncate" title={item.key}>
                      {item.key}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => handleCopy(event, item)}
                      className="inline-flex w-max items-center gap-1 rounded-full bg-neutral-200/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 transition hover:bg-neutral-300 dark:bg-neutral-700/60 dark:text-neutral-300"
                    >
                      <Copy className="h-3 w-3" /> Copy URL
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300">
                  {item.folder || 'root'}
                </td>
                <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300">
                  {formatBytes(item.size)}
                </td>
                <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        window.open(item.url, '_blank', 'noopener,noreferrer')
                      }}
                      className="rounded-full border theme-border p-1.5 text-neutral-500 transition hover:bg-theme-bg-secondary"
                      aria-label="Open in new tab"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleDownload(event, item)}
                      className="rounded-full border theme-border p-1.5 text-neutral-500 transition hover:bg-theme-bg-secondary"
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setSelected(item.key)
                        onSelect?.(item)
                      }}
                      className="rounded-full border theme-border p-1.5 text-neutral-500 transition hover:bg-theme-bg-secondary"
                      aria-label="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {showDeleteAction && (
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          handleDelete(item)
                        }}
                        className="rounded-full border border-red-200 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {confirmation.config && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.handleConfirm}
          config={confirmation.config}
        />
      )}
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
