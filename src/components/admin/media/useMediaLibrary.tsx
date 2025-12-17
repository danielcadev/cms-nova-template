'use client'

import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useMediaFetch } from './hooks/useMediaFetch'
import { useMediaMutations } from './hooks/useMediaMutations'
import { type MediaLibraryState, useMediaReducer } from './hooks/useMediaReducer'
export type { MediaLibraryState }

import type { MediaItem, SortOption, UploadResult, ViewOption } from './types'

interface MediaLibraryContextValue extends MediaLibraryState {
  totalPages: number
  setSearchTerm: (value: string) => void
  setFolder: (folder: string) => void
  setSort: (sort: SortOption) => void
  setView: (view: ViewOption) => void
  setPage: (page: number) => void
  refresh: () => void
  upload: (files: FileList | File[], folder?: string) => Promise<UploadResult[]>
  deleteItem: (key: string) => Promise<void>
  createFolder: (name: string) => Promise<boolean>
  removeFolder: (name: string) => Promise<boolean>
  setSelected: (key: string | null) => void
}

const MediaLibraryContext = createContext<MediaLibraryContextValue | null>(null)

interface MediaLibraryProviderProps {
  children: ReactNode
  initialFolder?: string
  pageSize?: number
}

export function MediaLibraryProvider({
  children,
  initialFolder = '',
  pageSize = 24,
}: MediaLibraryProviderProps) {
  const { state, dispatch } = useMediaReducer(initialFolder, pageSize)
  const [refreshToken, setRefreshToken] = useState(0)

  const refresh = useCallback(() => {
    setRefreshToken((prev) => prev + 1)
  }, [])

  // Action helpers that dispatch directly
  const setSearchTerm = useCallback(
    (value: string) => {
      dispatch({ type: 'SET_SEARCH_DRAFT', payload: value })
    },
    [dispatch],
  )

  const setFolder = useCallback(
    (folder: string) => {
      dispatch({ type: 'SET_FOLDER', payload: folder.trim() })
    },
    [dispatch],
  )

  const setSort = useCallback(
    (sort: SortOption) => {
      dispatch({ type: 'SET_SORT', payload: sort })
    },
    [dispatch],
  )

  const setView = useCallback(
    (view: ViewOption) => {
      dispatch({ type: 'SET_VIEW', payload: view })
    },
    [dispatch],
  )

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((state.total || 0) / state.pageSize)),
    [state.total, state.pageSize],
  )

  const setPage = useCallback(
    (page: number) => {
      const next = Math.max(1, Math.min(page, totalPages || 1))
      dispatch({ type: 'SET_PAGE', payload: next })
    },
    [dispatch, totalPages],
  )

  const setSelected = useCallback(
    (key: string | null) => {
      dispatch({ type: 'SET_SELECTED', payload: key })
    },
    [dispatch],
  )

  // Use sub-hooks for side effects and complex logic
  useMediaFetch({ state, dispatch, refreshToken })
  const { upload, deleteItem, createFolder, removeFolder } = useMediaMutations({
    state,
    dispatch,
    refresh,
    setFolder,
  })

  // Construct context value
  const value = useMemo<MediaLibraryContextValue>(
    () => ({
      ...state,
      totalPages,
      setSearchTerm,
      setFolder,
      setSort,
      setView,
      setPage,
      refresh,
      upload,
      deleteItem,
      createFolder,
      removeFolder,
      setSelected,
    }),
    [
      state,
      totalPages,
      setSearchTerm,
      setFolder,
      setSort,
      setView,
      setPage,
      refresh,
      upload,
      deleteItem,
      createFolder,
      removeFolder,
      setSelected,
    ],
  )

  return <MediaLibraryContext.Provider value={value}>{children}</MediaLibraryContext.Provider>
}

export function useMediaLibrary() {
  const ctx = useContext(MediaLibraryContext)
  if (!ctx) throw new Error('useMediaLibrary must be used within MediaLibraryProvider')
  return ctx
}
