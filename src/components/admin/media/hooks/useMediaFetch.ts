import { useEffect } from 'react'
import type { MediaItem } from '../types'
import type { MediaLibraryAction, MediaLibraryState } from './useMediaReducer'

interface ListResponse {
    success: boolean
    page: number
    pageSize: number
    total: number
    items: MediaItem[]
}

interface UseMediaFetchProps {
    state: MediaLibraryState
    dispatch: React.Dispatch<MediaLibraryAction>
    refreshToken: number
}

export function useMediaFetch({ state, dispatch, refreshToken }: UseMediaFetchProps) {
    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            const trimmed = state.searchDraft.trim()
            if (trimmed === state.filters.search.trim()) return
            dispatch({ type: 'APPLY_SEARCH', payload: trimmed })
        }, 300)
        return () => clearTimeout(handler)
    }, [state.searchDraft, state.filters.search, dispatch])

    // Load Folders
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
    }, [refreshToken, state.filters.folder, dispatch])

    // Load Items
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
        dispatch,
    ])
}
