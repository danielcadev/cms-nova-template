'use client'

import { Copy, Download, Link2 } from 'lucide-react'
import Image from 'next/image'
import { type MouseEvent, useCallback, useMemo, useState } from 'react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { useConfirmation } from '@/hooks/useConfirmation'
import type { MediaItem } from '../types'
import { useMediaLibrary } from '../useMediaLibrary'
import { MediaCard } from './MediaCard'

interface MediaGridProps {
    items?: MediaItem[]
    onSelect?: (item: MediaItem) => void
    onDeleted?: () => void
    showDeleteAction?: boolean
    emptyLabel?: string
    onConfirmSelect?: (item: MediaItem) => void
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
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                {items.map((item) => (
                    <MediaCard
                        key={item.key}
                        item={item}
                        isSelected={selectedKey === item.key}
                        isDeleting={deleting}
                        showDeleteAction={showDeleteAction}
                        onSelect={selectItem}
                        onDoubleClick={(item) => {
                            selectItem(item)
                            confirmOrPreview(item)
                        }}
                        onDelete={handleDelete}
                        onPreview={openPreview}
                        onCopy={handleCopy}
                        onDownload={handleDownload}
                    />
                ))}
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
