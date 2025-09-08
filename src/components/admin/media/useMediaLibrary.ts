// components/admin/media/useMediaLibrary.ts
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [folder, setFolder] = useState<string>('')
  const [sort, setSort] = useState<
    'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
  >('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/media/folders')
      if (!res.ok) throw new Error('Failed to load folders')
      const data = await res.json()
      if (data.success && Array.isArray(data.folders)) {
        const incoming: string[] = data.folders.filter((f: any) => typeof f === 'string')
        const set = new Set(incoming)
        if (folder) set.add(folder)
        setFolders(Array.from(set).sort())
      }
    } catch (e) {
      console.warn('Media folders load error', e)
    }
  }, [folder])

  const inflight = useRef(0)
  const fetchItems = useCallback(
    async (opts?: { page?: number; q?: string; folder?: string }) => {
      const token = ++inflight.current
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        const nextPage = opts?.page ?? page
        const nextQ = (opts?.q ?? q).trim()
        const nextFolder = (opts?.folder ?? folder).trim()
        params.set('page', String(nextPage))
        params.set('pageSize', String(pageSize))
        if (nextQ) params.set('q', nextQ)
        if (nextFolder) params.set('folder', nextFolder)
        if (sort) params.set('sort', sort)
        const url = `/api/media?${params.toString()}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to load media')
        const data: ListResponse = await res.json()
        if (!data.success) throw new Error('Error response')
        if (token !== inflight.current) return // ignore stale
        setItems(data.items || [])
        setTotal(data.total || 0)
      } catch (e: any) {
        if (token !== inflight.current) return
        setError(e?.message || 'Error loading media')
      } finally {
        if (token === inflight.current) setLoading(false)
      }
    },
    [page, pageSize, q, folder, sort],
  )

  const search = useCallback((query: string) => {
    setQ(query)
    setPage(1)
  }, [])

  const changeFolder = useCallback((f: string) => {
    setFolder(f)
    setPage(1)
  }, [])

  const upload = useCallback(
    async (files: FileList | File[], targetFolder?: string) => {
      const fArr = Array.from(files)
      const results: { success: boolean; item?: MediaItem; error?: string }[] = []

      // Small helpers to avoid long hangs
      const fetchWithTimeout = async (
        input: RequestInfo,
        init: RequestInit & { timeoutMs?: number } = {},
      ) => {
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), init.timeoutMs ?? 15000) // default 15s
        try {
          const res = await fetch(input, { ...init, signal: controller.signal })
          return res
        } finally {
          clearTimeout(id)
        }
      }

      const doServerUpload = async (file: File, folderToUse: string) => {
        const form = new FormData()
        form.append('file', file)
        if (folderToUse) form.append('folder', folderToUse)
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
              folder: folderToUse,
            },
          }
        }
        return { success: false as const, error: (data as any).error || 'Upload failed' }
      }

      const doPresignedUpload = async (file: File, folderToUse: string) => {
        // 1) Ask backend for presigned URL
        const presignRes = await fetchWithTimeout('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            folder: folderToUse || 'uploads',
          }),
          timeoutMs: 10000, // 10s
        })
        if (!presignRes.ok) throw new Error('Presign request failed')
        const presignJson = await presignRes.json()
        if (!presignJson?.success) throw new Error(presignJson?.error || 'Presign error')
        const { url, key, headers, publicUrl } = presignJson.data

        // 2) PUT file to S3
        const putRes = await fetchWithTimeout(url, {
          method: 'PUT',
          headers,
          body: file,
          timeoutMs: 120000,
        })
        if (!putRes.ok) throw new Error('S3 upload failed')

        // 3) Register asset in DB
        const fileUrl = publicUrl
        const registerRes = await fetchWithTimeout('/api/media/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            url: fileUrl,
            mimeType: file.type,
            size: file.size,
            folder: folderToUse || 'uploads',
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
            url: (regJson as any).data?.url || fileUrl,
            mimeType: file.type,
            size: file.size,
            folder: folderToUse,
          },
        }
      }

      // Concurrency control for multiple uploads
      const folderToUse = targetFolder || folder || 'uploads'
      const CONCURRENCY = 3
      let index = 0
      const worker = async () => {
        while (true) {
          const i = index++
          if (i >= fArr.length) break
          const file = fArr[i] as File
          try {
            const r = await doPresignedUpload(file, folderToUse)
            results[i] = r
          } catch (_e) {
            const r = await doServerUpload(file, folderToUse)
            results[i] = r
          }
        }
      }

      const workers = Array.from({ length: Math.min(CONCURRENCY, fArr.length) }, () => worker())
      await Promise.all(workers)

      await fetchItems({ page: 1, q, folder: targetFolder ?? folder })
      return results
    },
    [folder, q, fetchItems],
  )

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])
  useEffect(() => {
    fetchItems({ page })
  }, [fetchItems, page])

  return {
    items,
    folders,
    page,
    total,
    pageSize,
    totalPages,
    q,
    folder,
    loading,
    error,
    setPage,
    search,
    changeFolder,
    fetchItems,
    upload,
    sort,
    setSort,
    view,
    setView,
  } as const
}
