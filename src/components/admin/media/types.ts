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

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
export type ViewOption = 'grid' | 'list'

export type UploadResult = { success: true; item: MediaItem } | { success: false; error: string }
