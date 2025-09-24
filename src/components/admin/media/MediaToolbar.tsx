// components/admin/media/MediaToolbar.tsx
'use client'

import { useState } from 'react'

export function MediaToolbar({
  q,
  onSearch,
  folders,
  folder,
  onFolder,
  onUpload,
  sort,
  setSort,
  view,
  setView,
}: {
  q: string
  onSearch: (q: string) => void
  folders: string[]
  folder: string
  onFolder: (folder: string) => void
  onUpload: (files: FileList) => void
  sort: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
  setSort: (s: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc') => void
  view: 'grid' | 'list'
  setView: (v: 'grid' | 'list') => void
}) {
  const [newFolder, setNewFolder] = useState('')

  const pretty = (f: string) => (f ? `/${f.replace(/^\/+/, '')}` : 'All folders')

  const createFolder = async () => {
    const name = newFolder.trim().replace(/^\/+/, '')
    if (!name) return
    const res = await fetch('/api/media/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      setNewFolder('')
      // trigger a refresh by switching to the new folder
      onFolder(name)
    }
  }

  const deleteFolder = async () => {
    if (!folder) return
    const ok = confirm(
      `Delete folder "/${folder}" and all its files from S3? This cannot be undone.`,
    )
    if (!ok) return
    const res = await fetch('/api/media/folders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folder }),
    })
    if (res.ok) {
      onFolder('') // go back to all folders
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: search + folder */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search media..."
            className="pl-9 pr-3 py-2 rounded-lg border theme-border theme-card theme-text placeholder:theme-text-muted w-full"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm theme-text-secondary">
            🔎
          </span>
        </div>
        <select
          value={folder}
          onChange={(e) => onFolder(e.target.value)}
          className="px-3 py-2 rounded-lg border theme-border theme-card theme-text min-w-[150px]"
        >
          <option value="">All folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {pretty(f)}
            </option>
          ))}
        </select>
        {folder && (
          <button
            type="button"
            onClick={deleteFolder}
            className="px-3 py-2 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700"
          >
            Delete folder
          </button>
        )}
      </div>

      {/* Bottom row: upload + new folder + sort/view */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover cursor-pointer w-fit">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && onUpload(e.target.files)}
            />
            <span className="text-sm theme-text">Upload</span>
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="New folder (e.g., uploads/main)"
              className="px-3 py-2 rounded-lg border theme-border theme-card theme-text placeholder:theme-text-muted min-w-[180px]"
            />
            <button
              type="button"
              onClick={createFolder}
              className="px-3 py-2 rounded-lg border theme-border theme-card hover:theme-card-hover"
            >
              Create folder
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2 rounded-lg border theme-border theme-card theme-text"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="size-asc">Size ↑</option>
            <option value="size-desc">Size ↓</option>
          </select>
          <div className="flex rounded-lg border theme-border overflow-hidden">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={`px-3 py-2 text-sm ${view === 'grid' ? 'theme-card' : 'theme-card-hover'}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={`px-3 py-2 text-sm ${view === 'list' ? 'theme-card' : 'theme-card-hover'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
