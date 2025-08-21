// components/admin/media/MediaPicker.tsx
'use client'

import { useEffect, useState } from 'react'
import { MediaGrid } from './MediaGrid'
import { MediaToolbar } from './MediaToolbar'
import { type MediaItem, useMediaLibrary } from './useMediaLibrary'

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
  folder,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (item: MediaItem) => void
  title?: string
  folder?: string
}) {
  const lib = useMediaLibrary()
  const [localOpen, setLocalOpen] = useState(isOpen)

  useEffect(() => {
    setLocalOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (folder) lib.changeFolder(folder)
    // Effect should only run when isOpen changes
  }, [folder, lib.changeFolder])

  if (!localOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setLocalOpen(false)
          onClose()
        }}
        aria-label="Close media picker"
      />
      <div className="relative w-full max-w-5xl mx-4 theme-card theme-border border rounded-2xl shadow-xl">
        <div className="p-5 border-b theme-border flex items-center justify-between">
          <h2 className="text-lg font-semibold theme-text">{title}</h2>
          <button
            type="button"
            onClick={() => {
              setLocalOpen(false)
              onClose()
            }}
            className="px-2 py-1 rounded-lg theme-card-hover theme-text-secondary hover:theme-text"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
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

          <MediaGrid
            items={lib.items}
            onSelect={(item) => {
              onSelect(item)
              setLocalOpen(false)
              onClose()
            }}
            onDeleted={() => lib.fetchItems({ page: lib.page, q: lib.q, folder: lib.folder })}
          />

          <div className="flex items-center justify-between pt-2">
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
  )
}
