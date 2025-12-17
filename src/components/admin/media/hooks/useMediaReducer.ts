import { useReducer } from 'react'
import type { MediaItem, SortOption, ViewOption } from '../types'

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

export type MediaLibraryAction =
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

export function useMediaReducer(initialFolder = '', pageSize = 24) {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        filters: { ...initialState.filters, folder: initialFolder.trim() },
        searchDraft: initialState.filters.search,
        pageSize,
    })

    return { state, dispatch }
}

export type { MediaLibraryState }
