'use client'

import { Copy, Download, Eye, Link2, Trash2, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import type { MouseEvent } from 'react'
import type { MediaItem } from './types'

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

interface MediaCardProps {
    item: MediaItem
    isSelected: boolean
    isDeleting: boolean
    showDeleteAction: boolean
    onSelect: (item: MediaItem) => void
    onDoubleClick: (item: MediaItem) => void
    onDelete: (event: MouseEvent<HTMLElement>, key: string) => void
    onPreview: (event: MouseEvent<HTMLElement>, item: MediaItem) => void
    onCopy: (event: MouseEvent<HTMLElement>, item: MediaItem) => void
    onDownload: (event: MouseEvent<HTMLElement>, item: MediaItem) => void
}

export function MediaCard({
    item,
    isSelected,
    isDeleting,
    showDeleteAction,
    onSelect,
    onDoubleClick,
    onDelete,
    onPreview,
    onCopy,
    onDownload,
}: MediaCardProps) {
    const isImage = item.mimeType.startsWith('image/')
    const fileName = item.key.split('/').pop() ?? item.key
    const fileFolder =
        item.folder || (item.key.includes('/') ? item.key.split('/').slice(0, -1).join('/') : 'root')
    const fileType = item.mimeType.split('/')[0]

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${isSelected
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
                    onClick={() => onSelect(item)}
                    onDoubleClick={() => onDoubleClick(item)}
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
                                disabled={isDeleting}
                                onClick={(event) => onDelete(event, item.key)}
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
                        onClick={(event) => onPreview(event, item)}
                    />
                    <ActionButton
                        icon={Copy}
                        label="Copy URL"
                        onClick={(event) => onCopy(event, item)}
                    />
                    <ActionButton
                        icon={Download}
                        label="Download"
                        onClick={(event) => onDownload(event, item)}
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
}
