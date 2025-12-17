// components/admin/media/MediaToolbar.tsx
'use client'

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderPlus,
  LayoutGrid,
  List,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { SortOption } from './types'
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchDraft}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search assets..."
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-10 pr-12 text-sm shadow-sm transition-all focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 placeholder:text-zinc-400"
          />
          {searchDraft && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {hasPendingSearch && (
            <span className="absolute right-3 bottom-1 text-[10px] uppercase tracking-wide text-blue-500 font-bold">
              updating
            </span>
          )}
        </div>

        {/* Folder Select & Management */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={filters.folder}
              onChange={(event) => setFolder(event.target.value)}
              className="h-10 appearance-none rounded-xl border border-zinc-200 bg-white pl-4 pr-10 text-sm font-medium shadow-sm transition-all hover:border-zinc-300 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 text-zinc-700 cursor-pointer"
            >
              <option value="">All media</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {prettyFolder(folder)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>

          {allowFolderManagement && !showNewFolder && (
            <button
              type="button"
              onClick={() => setShowNewFolder(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <FolderPlus className="h-4 w-4" />
              New folder
            </button>
          )}

          {allowFolderManagement && showNewFolder && (
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <input
                value={newFolder}
                onChange={(event) => setNewFolder(event.target.value)}
                placeholder="folder/name"
                className="w-[140px] border-none bg-transparent text-sm focus:outline-none px-2 py-1 placeholder:text-zinc-300"
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
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
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
                className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {allowFolderManagement && filters.folder && (
            <button
              type="button"
              onClick={handleDeleteFolder}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:border-red-300"
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
            <label
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-zinc-200 transition-all cursor-pointer active:scale-95',
                uploading
                  ? 'bg-zinc-700 cursor-wait'
                  : 'bg-zinc-900 hover:bg-zinc-800 hover:scale-105',
              )}
            >
              <UploadCloud className="h-4 w-4" />
              <span>{uploading ? 'Uploading…' : 'Upload media'}</span>
              <input
                type="file"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(event) => event.target.files && upload(event.target.files)}
              />
            </label>

            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400 font-medium ml-2">
              <span className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                {prettyFolder(filters.folder)}
              </span>
              {filters.folder && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-900">
                    {filters.folder}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          {showSortControls && (
            <div className="flex flex-wrap items-center gap-1 bg-zinc-100/50 p-1 rounded-full">
              {sortOptions.map((option) => {
                const isActive = filters.sort === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSort(option.value)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50',
                    )}
                    title={option.hint}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          )}

          {showViewToggle && (
            <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  filters.view === 'grid'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-zinc-200" />
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  filters.view === 'list'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
