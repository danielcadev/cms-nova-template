export interface Field {
    id: string
    label: string
    apiIdentifier: string
    type: string
    isRequired: boolean
}

export interface ContentEntry {
    id: string
    data: any
    status: string
    createdAt: string
    updatedAt: string
}

export interface ContentType {
    id: string
    name: string
    apiIdentifier: string
    description?: string | null
    fields: Field[]
    entries: ContentEntry[]
}

export interface ContentEntriesPageProps {
    contentType: ContentType
}
