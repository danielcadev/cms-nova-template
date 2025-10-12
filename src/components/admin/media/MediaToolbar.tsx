// components/admin/media/MediaToolbar.tsx
'use client'

import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  LayoutGrid,
  List,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SortOption } from './useMediaLibrary'
import { useMediaLibrary } from './useMediaLibrary'

interface MediaToolbarProps {
  allowFolderManagement?: boolean
  allowUpload?: boolean
  showSortControls?: boolean
  showViewToggle?: boolean
}

const sortOptions: Array<{ value: SortOption; label: string; hint: string }> = [
  { value: 'newest', label: 'Newest', hint: 'Latest uploads first' },
  { value: 'oldest', label: 'Oldest', hint: 'Chronological order' },
  { value: 'name-asc', label: 'Name A–Z', hint: 'Alphabetical order' },
  { value: 'name-desc', label: 'Name Z–A', hint: 'Reverse alphabetical order' },
  { value: 'size-desc', label: 'Size ↓', hint: 'Large files first' },
  { value: 'size-asc', label: 'Size ↑', hint: 'Small files first' },
]

export function MediaToolbar({
  allowFolderManagement = true,
  allowUpload = true,
  showSortControls = true,
  showViewToggle = true,
}: MediaToolbarProps) {
  const {
    searchDraft,
    setSearchTerm,
    folders,
    filters,
    setFolder,
    upload,
    setSort,
    setView,
    uploading,
    createFolder,
    removeFolder,
  } = useMediaLibrary()

  const [newFolder, setNewFolder] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)

  const prettyFolder = useMemo(
    () => (folder: string) => (folder ? folder.replace(/^\/+/u, '') : 'All media'),
    [],
  )

  const hasPendingSearch = searchDraft.trim() !== filters.search.trim()

  const handleCreateFolder = async () => {
    const name = newFolder.trim()
    if (!name) return
    const created = await createFolder(name)
    if (created) {
      setNewFolder('')
      setShowNewFolder(false)
    }
  }

  const handleDeleteFolder = async () => {
    if (!filters.folder) return
    const ok = window.confirm(
      `Delete folder "/${filters.folder}" and all its files from S3? This cannot be undone.`,
    )
    if (!ok) return
    await removeFolder(filters.folder)
  }

  return (
    <div className="rounded-2xl border theme-border bg-gradient-to-br from-theme-bg-secondary/80 via-theme-bg-secondary/40 to-transparent p-4 md:p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-muted" />
            <input
              value={searchDraft}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, type or folder..."
              className="h-11 w-full rounded-xl border theme-border bg-white/90 px-10 pr-12 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:bg-zinc-900/80"
            />
            {searchDraft && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs theme-text-secondary hover:theme-text"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {hasPendingSearch && (
              <span className="absolute right-3 bottom-1 text-[11px] uppercase tracking-wide text-blue-500">
                updating…
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={filters.folder}
                onChange={(event) => setFolder(event.target.value)}
                className="h-11 appearance-none rounded-xl border theme-border bg-white/90 pl-4 pr-10 text-sm font-medium shadow-sm transition hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:bg-zinc-900/80"
              >
                <option value="">All media</option>
                {folders.map((folder) => (
                  <option key={folder} value={folder}>
                    {prettyFolder(folder)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-muted" />
            </div>

            {allowFolderManagement && !showNewFolder && (
              <button
                type="button"
                onClick={() => setShowNewFolder(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-300/70 bg-blue-50/60 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-100/70 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-300"
              >
                <FolderPlus className="h-4 w-4" />
                New folder
              </button>
            )}

            {allowFolderManagement && showNewFolder && (
              <div className="flex items-center gap-2 rounded-xl border border-blue-300/70 bg-white/90 px-3 py-2 shadow-sm dark:bg-zinc-900/80">
                <input
                  value={newFolder}
                  onChange={(event) => setNewFolder(event.target.value)}
                  placeholder="folder/name"
                  className="min-w-[160px] border-none bg-transparent text-sm focus:outline-none"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleCreateFolder()
                    }
                    if (event.key === 'Escape') {
                      event.preventDefault()
                      setShowNewFolder(false)
                      setNewFolder('')
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                  disabled={!newFolder.trim()}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFolder(false)
                    setNewFolder('')
                  }}
                  className="rounded-lg px-2 py-1 text-xs font-medium theme-text-secondary hover:theme-text"
                >
                  Cancel
                </button>
              </div>
            )}

            {allowFolderManagement && filters.folder && (
              <button
                type="button"
                onClick={handleDeleteFolder}
                className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {allowUpload && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-xl bg-blue-500/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-within:ring-2 focus-within:ring-blue-200">
                <UploadCloud className="h-4 w-4" />
                <span>{uploading ? 'Uploading…' : 'Upload media'}</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => event.target.files && upload(event.target.files)}
                />
              </label>

              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                <span className="rounded-full bg-neutral-200/80 px-2 py-1 dark:bg-neutral-700/60">
                  {prettyFolder(filters.folder)}
                </span>
                {filters.folder && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                      {filters.folder}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {showSortControls && (
              <div className="flex flex-wrap items-center gap-2">
                {sortOptions.map((option) => {
                  const isActive = filters.sort === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSort(option.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition hover:shadow-sm ${
                        isActive
                          ? 'bg-blue-500 text-white shadow'
                          : 'bg-white/80 text-neutral-600 hover:bg-white dark:bg-zinc-900/80 dark:text-neutral-300'
                      }`}
                      title={option.hint}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            )}

            {showViewToggle && (
              <div className="flex items-center overflow-hidden rounded-xl border theme-border bg-white/70 shadow-sm backdrop-blur-sm dark:bg-zinc-900/70">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                    filters.view === 'grid'
                      ? 'bg-blue-500 text-white shadow-inner'
                      : 'text-neutral-600 hover:bg-white/80 dark:text-neutral-300'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                    filters.view === 'list'
                      ? 'bg-blue-500 text-white shadow-inner'
                      : 'text-neutral-600 hover:bg-white/80 dark:text-neutral-300'
                  }`}
                >
                  <List className="h-4 w-4" /> List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
