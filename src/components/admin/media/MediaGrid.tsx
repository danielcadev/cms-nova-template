// components/admin/media/MediaGrid.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useConfirmation } from '@/hooks/useConfirmation'
import type { MediaItem } from './useMediaLibrary'

export function MediaGrid({
  items,
  onSelect,
  onDeleted,
}: {
  items: MediaItem[]
  onSelect?: (item: MediaItem) => void
  onDeleted?: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [preview, setPreview] = useState<MediaItem | null>(null)
  const confirmation = useConfirmation()

  const deleteItem = (e: React.MouseEvent, key: string) => {
    e.preventDefault()
    e.stopPropagation()

    confirmation.confirm(
      {
        title: 'Eliminar Archivo',
        description:
          '¿Estás seguro de que quieres eliminar este archivo de S3 y la biblioteca de medios?\n\nEsta acción no se puede deshacer.',
        confirmText: 'Eliminar Archivo',
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key }),
          })
          const data = await res.json()
          if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed')
          onDeleted?.()
        } catch (err) {
          alert((err as Error).message)
          throw err
        }
      },
    )
  }

  const selectItem = (m: MediaItem) => {
    setSelected(m.key)
    onSelect?.(m)
  }

  if (!items.length) {
    return <div className="text-center py-12 theme-text-secondary">No media found</div>
  }
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((m) => (
          <div
            key={m.key}
            className={`group relative rounded-lg overflow-hidden border theme-border theme-card hover:theme-card-hover transition shadow-sm hover:shadow-md ${selected === m.key ? 'ring-2 ring-blue-500' : ''}`}
          >
            <button
              type="button"
              onClick={() => selectItem(m)}
              className="w-full text-left focus:outline-none"
              aria-label={`Select ${m.key}`}
            >
              <div className="aspect-square relative">
                {m.mimeType.startsWith('image/') ? (
                  <Image
                    src={m.url}
                    alt={m.alt || m.title || m.key}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center theme-text-secondary text-xs">
                    {m.mimeType}
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 px-2 py-1 text-[11px] theme-bg-secondary/80 backdrop-blur theme-text truncate">
                {m.key}
              </div>
            </button>
            {/* Hover overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-start justify-between p-2 opacity-0 group-hover:opacity-100 pointer-events-none">
              <div className="flex gap-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setPreview(m)
                  }}
                  className="px-2 py-1 rounded-md border theme-border theme-card hover:theme-card-hover text-xs theme-text"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigator.clipboard.writeText(m.url)
                  }}
                  className="px-2 py-1 rounded-md border theme-border theme-card hover:theme-card-hover text-xs theme-text"
                >
                  Copy URL
                </button>
              </div>
              <div className="pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => deleteItem(e, m.key)}
                  className="px-2 py-1 rounded-md border border-red-300 bg-red-50 hover:bg-red-100 text-xs text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          {preview && (
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="truncate">{preview.key}</DialogTitle>
              </DialogHeader>
              <div className="relative w-full aspect-video bg-black/5 rounded-lg overflow-hidden">
                {preview.mimeType.startsWith('image/') ? (
                  <Image
                    src={preview.url}
                    alt={preview.alt || preview.title || preview.key}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center theme-text-secondary text-sm">
                    {preview.mimeType}
                  </div>
                )}
              </div>
              <div className="text-sm theme-text-secondary break-all">
                <div>Type: {preview.mimeType}</div>
                <div>Size: {Math.round((preview.size || 0) / 1024)} KB</div>
                {preview.width && preview.height && (
                  <div>
                    Dimensions: {preview.width}×{preview.height}
                  </div>
                )}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(preview.url)}
                    className="px-3 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover text-sm"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
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
