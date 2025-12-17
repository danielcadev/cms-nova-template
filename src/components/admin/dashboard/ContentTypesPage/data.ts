export interface ContentTypeField {
    id: string
    name: string
    type: string
    required: boolean
    options?: string[]
}

export interface ContentType {
    id: string
    name: string
    slug: string
    fields: ContentTypeField[]
}

export interface ContentEntryAuthor {
    name: string
    email: string
}

export interface ContentEntry {
    id: string
    title: string
    slug: string
    status: 'draft' | 'published'
    createdAt?: string
    updatedAt?: string
    author?: ContentEntryAuthor
    data?: Record<string, any>
    contentType?: ContentType
}

export interface ContentEntriesPageProps {
    contentTypeSlug: string
}

export interface EditContentEntryProps {
    contentTypeSlug: string
    entryId: string
}

export interface CreateContentEntryProps {
    contentTypeSlug: string
}

export interface ContentTypeData {
    id: string
    name: string
    apiIdentifier: string
    description?: string | null
    fields: any[]
    createdAt: string
    updatedAt: string
}

export interface ContentTypesPageProps {
    initialContentTypes: ContentTypeData[]
}
