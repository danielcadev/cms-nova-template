import { useCallback } from 'react'
import { toast } from '@/hooks/use-toast'
import type { UploadResult } from '../types'
import type { MediaLibraryAction, MediaLibraryState } from './useMediaReducer'

interface UseMediaMutationsProps {
    state: MediaLibraryState
    dispatch: React.Dispatch<MediaLibraryAction>
    refresh: () => void
    setFolder: (folder: string) => void
}

const fetchWithTimeout = async (
    input: RequestInfo,
    init: RequestInit & { timeoutMs?: number } = {},
) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), init.timeoutMs ?? 10000)
    try {
        const res = await fetch(input, { ...init, signal: controller.signal })
        return res
    } finally {
        clearTimeout(id)
    }
}

export function useMediaMutations({
    state,
    dispatch,
    refresh,
    setFolder,
}: UseMediaMutationsProps) {
    const upload = useCallback(
        async (files: FileList | File[], targetFolder?: string): Promise<UploadResult[]> => {
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
        [state.filters.folder, refresh, dispatch],
    )

    const deleteItem = useCallback(
        async (key: string) => {
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
        [refresh, state.selectedKey, dispatch],
    )

    const createFolder = useCallback(
        async (name: string) => {
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

    const removeFolder = useCallback(
        async (name: string) => {
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

    return { upload, deleteItem, createFolder, removeFolder }
}
