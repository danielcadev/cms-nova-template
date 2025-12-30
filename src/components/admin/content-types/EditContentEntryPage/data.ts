export interface Field {
    id: string
    label: string
    apiIdentifier: string
    type: string
    isRequired: boolean
    metadata?: any
}

export interface ContentType {
    id: string
    name: string
    apiIdentifier: string
    description?: string | null
    fields: Field[]
}

export interface ContentEntry {
    id: string
    title: string
    slug: string
    seoOptions?: any
    status: string
    isFeatured: boolean
    category?: string | null
    tags: string[]
    publishedAt?: string | null
    data: any
    createdAt: string
    updatedAt: string
    contentType: ContentType
}

export interface EditContentEntryPageProps {
    entry: ContentEntry
}
