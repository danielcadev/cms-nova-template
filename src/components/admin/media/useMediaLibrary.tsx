// components/admin/media/useMediaLibrary.tsx
'use client'

import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { toast } from '@/hooks/use-toast'

export interface MediaItem {
  id: string
  key: string
  url: string
  mimeType: string
  size: number
  width?: number | null
  height?: number | null
  title?: string | null
  alt?: string | null
  folder: string
  createdAt?: string
}

interface ListResponse {
  success: boolean
  page: number
  pageSize: number
  total: number
  items: MediaItem[]
}

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
export type ViewOption = 'grid' | 'list'

interface MediaLibraryState {
  items: MediaItem[]
  folders: string[]
  page: number
  pageSize: number
  total: number
  filters: {
    search: string
    folder: string
    sort: SortOption
    view: ViewOption
  }
  searchDraft: string
  loading: boolean
  uploading: boolean
  deleting: boolean
  error: string | null
  initialized: boolean
  selectedKey: string | null
}

type MediaLibraryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: { items: MediaItem[]; total: number } }
  | { type: 'SET_FOLDERS'; payload: string[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_VIEW'; payload: ViewOption }
  | { type: 'SET_FOLDER'; payload: string }
  | { type: 'APPLY_SEARCH'; payload: string }
  | { type: 'SET_SEARCH_DRAFT'; payload: string }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'SET_SELECTED'; payload: string | null }
  | { type: 'MARK_INITIALIZED' }

const initialState: MediaLibraryState = {
  items: [],
  folders: [],
  page: 1,
  pageSize: 24,
  total: 0,
  filters: {
    search: '',
    folder: '',
    sort: 'newest',
    view: 'grid',
  },
  searchDraft: '',
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
  initialized: false,
  selectedKey: null,
}

function reducer(state: MediaLibraryState, action: MediaLibraryAction): MediaLibraryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: action.payload ? null : state.error }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false,
        initialized: true,
      }
    case 'SET_FOLDERS':
      return { ...state, folders: action.payload }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'SET_SORT':
      return {
        ...state,
        filters: { ...state.filters, sort: action.payload },
        page: 1,
      }
    case 'SET_VIEW':
      return { ...state, filters: { ...state.filters, view: action.payload } }
    case 'SET_FOLDER':
      return {
        ...state,
        filters: { ...state.filters, folder: action.payload },
        page: 1,
      }
    case 'APPLY_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
        page: 1,
      }
    case 'SET_SEARCH_DRAFT':
      return { ...state, searchDraft: action.payload }
    case 'SET_UPLOADING':
      return { ...state, uploading: action.payload }
    case 'SET_DELETING':
      return { ...state, deleting: action.payload }
    case 'SET_SELECTED':
      return { ...state, selectedKey: action.payload }
    case 'MARK_INITIALIZED':
      return { ...state, initialized: true }
    default:
      return state
  }
}

type UploadResult = { success: true; item: MediaItem } | { success: false; error: string }

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
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    filters: { ...initialState.filters, folder: initialFolder.trim() },
    searchDraft: initialState.filters.search,
    pageSize,
  })
  const [refreshToken, setRefreshToken] = useState(0)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((state.total || 0) / state.pageSize)),
    [state.total, state.pageSize],
  )

  const setSearchTerm = useCallback((value: string) => {
    dispatch({ type: 'SET_SEARCH_DRAFT', payload: value })
  }, [])

  const setFolder = useCallback((folder: string) => {
    dispatch({ type: 'SET_FOLDER', payload: folder.trim() })
  }, [])

  const setSort = useCallback((sort: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: sort })
  }, [])

  const setView = useCallback((view: ViewOption) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  const setPage = useCallback(
    (page: number) => {
      const next = Math.max(1, Math.min(page, totalPages || 1))
      dispatch({ type: 'SET_PAGE', payload: next })
    },
    [totalPages],
  )

  const setSelected = useCallback((key: string | null) => {
    dispatch({ type: 'SET_SELECTED', payload: key })
  }, [])

  const refresh = useCallback(() => {
    setRefreshToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = state.searchDraft.trim()
      if (trimmed === state.filters.search.trim()) return
      dispatch({ type: 'APPLY_SEARCH', payload: trimmed })
    }, 300)
    return () => clearTimeout(handler)
  }, [state.searchDraft, state.filters.search])

  useEffect(() => {
    const currentRefresh = refreshToken
    let cancelled = false
    const loadFolders = async () => {
      try {
        const res = await fetch('/api/media/folders')
        if (!res.ok) throw new Error('Failed to load folders')
        const data = await res.json()
        if (cancelled || refreshToken !== currentRefresh) return
        if (data.success && Array.isArray(data.folders)) {
          const unique = new Set<string>()
          for (const entry of data.folders) {
            if (typeof entry === 'string' && entry.trim()) {
              unique.add(entry.trim())
            }
          }
          if (state.filters.folder) unique.add(state.filters.folder)
          dispatch({ type: 'SET_FOLDERS', payload: Array.from(unique).sort() })
        }
      } catch (error) {
        console.warn('Media folders load error', error)
      }
    }
    loadFolders()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken, state.filters.folder])

  useEffect(() => {
    const currentRefresh = refreshToken
    const controller = new AbortController()
    let active = true

    const loadItems = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const params = new URLSearchParams()
        params.set('page', String(state.page))
        params.set('pageSize', String(state.pageSize))
        if (state.filters.search.trim()) params.set('q', state.filters.search.trim())
        if (state.filters.folder.trim()) params.set('folder', state.filters.folder.trim())
        if (state.filters.sort) params.set('sort', state.filters.sort)

        const res = await fetch(`/api/media?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Failed to load media')
        const data: ListResponse = await res.json()
        if (!data.success) throw new Error('Failed to load media')

        if (!active || refreshToken !== currentRefresh) return

        const incomingTotal = data.total ?? 0
        const nextTotalPages = Math.max(1, Math.ceil(incomingTotal / state.pageSize))
        if (state.page > nextTotalPages && incomingTotal > 0) {
          dispatch({ type: 'SET_PAGE', payload: nextTotalPages })
          return
        }

        dispatch({
          type: 'SET_ITEMS',
          payload: { items: data.items || [], total: incomingTotal },
        })
        dispatch({ type: 'SET_ERROR', payload: null })
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === 'AbortError')) return
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to load media',
        })
        dispatch({ type: 'MARK_INITIALIZED' })
      } finally {
        if (active && refreshToken === currentRefresh) {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    loadItems()

    return () => {
      active = false
      controller.abort()
    }
  }, [
    state.page,
    state.pageSize,
    state.filters.search,
    state.filters.folder,
    state.filters.sort,
    refreshToken,
  ])

  const fetchWithTimeout = useCallback(
    async (input: RequestInfo, init: RequestInit & { timeoutMs?: number } = {}) => {
      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), init.timeoutMs ?? 10000)
      try {
        const res = await fetch(input, { ...init, signal: controller.signal })
        return res
      } finally {
        clearTimeout(id)
      }
    },
    [],
  )

  const upload = useCallback<MediaLibraryContextValue['upload']>(
    async (files, targetFolder) => {
      const fileArray = Array.from(files)
      if (!fileArray.length) return []

      dispatch({ type: 'SET_UPLOADING', payload: true })
      const results: UploadResult[] = []
      const folderToUse = targetFolder || state.filters.folder || 'uploads'

      const doServerUpload = async (file: File, folderName: string) => {
        const form = new FormData()
        form.append('file', file)
        if (folderName) form.append('folder', folderName)
        const res = await fetchWithTimeout('/api/upload', {
          method: 'POST',
          body: form,
          timeoutMs: 120000,
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && (data as any).success) {
          return {
            success: true as const,
            item: {
              id: (data as any).key,
              key: (data as any).key,
              url: (data as any).url,
              mimeType: (data as any).type,
              size: (data as any).size,
              folder: folderName,
            },
          }
        }
        return {
          success: false as const,
          error: (data as any).error || 'Upload failed',
        }
      }

      const doPresignedUpload = async (file: File, folderName: string) => {
        const presignRes = await fetchWithTimeout('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            folder: folderName || 'uploads',
          }),
          timeoutMs: 10000,
        })
        if (!presignRes.ok) throw new Error('Presign request failed')
        const presignJson = await presignRes.json()
        if (!presignJson?.success) throw new Error(presignJson?.error || 'Presign error')
        const { url, key, headers, publicUrl } = presignJson.data

        const putRes = await fetchWithTimeout(url, {
          method: 'PUT',
          headers,
          body: file,
          timeoutMs: 45000,
        })
        if (!putRes.ok) throw new Error('S3 upload failed')

        const registerRes = await fetchWithTimeout('/api/media/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            url: publicUrl,
            mimeType: file.type,
            size: file.size,
            folder: folderName || 'uploads',
          }),
          timeoutMs: 10000,
        })
        if (!registerRes.ok) throw new Error('Register asset failed')
        const regJson = await registerRes.json().catch(() => ({}))
        if (!(regJson as any)?.success) throw new Error((regJson as any)?.error || 'Register error')

        return {
          success: true as const,
          item: {
            id: key,
            key,
            url: (regJson as any).data?.url || publicUrl,
            mimeType: file.type,
            size: file.size,
            folder: folderName,
          },
        }
      }

      const CONCURRENCY = 3
      let pointer = 0
      const worker = async () => {
        while (pointer < fileArray.length) {
          const index = pointer++
          const file = fileArray[index]
          try {
            results[index] = await doPresignedUpload(file, folderToUse)
          } catch (error) {
            if (error instanceof Error) {
              console.warn('Presigned upload failed, falling back', error)
            }
            results[index] = await doServerUpload(file, folderToUse)
          }
        }
      }

      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, fileArray.length) }, () => worker()),
      )

      refresh()

      const successItems = results.filter(
        (res): res is Extract<UploadResult, { success: true }> => res?.success === true,
      )
      const failedItems = results.filter(
        (res): res is Extract<UploadResult, { success: false }> => res?.success === false,
      )

      if (successItems.length) {
        toast.success({
          title:
            successItems.length === 1 ? 'Upload complete' : `${successItems.length} files uploaded`,
          description: folderToUse ? `Saved in ${folderToUse}` : 'Saved in the root folder',
        })
      }
      if (failedItems.length) {
        toast.error({
          title: 'Upload failed',
          description: failedItems[0]?.error || 'Please try again.',
        })
      }

      dispatch({ type: 'SET_UPLOADING', payload: false })
      return results
    },
    [fetchWithTimeout, refresh, state.filters.folder],
  )

  const deleteItem = useCallback<MediaLibraryContextValue['deleteItem']>(
    async (key) => {
      if (!key) return
      dispatch({ type: 'SET_DELETING', payload: true })
      try {
        const res = await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !(data as any)?.success) {
          throw new Error((data as any)?.error || 'Delete failed')
        }
        if (state.selectedKey === key) {
          dispatch({ type: 'SET_SELECTED', payload: null })
        }
        refresh()
        toast.success({ title: 'File deleted', description: key })
      } catch (error) {
        toast.error({
          title: 'Unable to delete file',
          description: error instanceof Error ? error.message : 'Please try again.',
        })
        throw error
      } finally {
        dispatch({ type: 'SET_DELETING', payload: false })
      }
    },
    [refresh, state.selectedKey],
  )

  const createFolder = useCallback<MediaLibraryContextValue['createFolder']>(
    async (name) => {
      const trimmed = name.trim().replace(/^\/+/, '')
      if (!trimmed) return false
      const res = await fetch('/api/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!res.ok) {
        toast.error({
          title: 'Folder not created',
          description: `We could not create "${trimmed}".`,
        })
        return false
      }
      refresh()
      setFolder(trimmed)
      toast.success({ title: 'Folder created', description: `/${trimmed}` })
      return true
    },
    [refresh, setFolder],
  )

  const removeFolder = useCallback<MediaLibraryContextValue['removeFolder']>(
    async (name) => {
      const trimmed = name.trim().replace(/^\/+/, '')
      if (!trimmed) return false
      const res = await fetch('/api/media/folders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!res.ok) {
        toast.error({
          title: 'Folder not deleted',
          description: `Could not remove "${trimmed}".`,
        })
        return false
      }
      if (state.filters.folder === trimmed) setFolder('')
      refresh()
      toast.info({ title: 'Folder deleted', description: `/${trimmed}` })
      return true
    },
    [refresh, setFolder, state.filters.folder],
  )

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

export type { SortOption, ViewOption, UploadResult }
