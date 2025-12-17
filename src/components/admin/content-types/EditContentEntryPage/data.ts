export interface Field {
    id: string
    label: string
    apiIdentifier: string
    type: string
    isRequired: boolean
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
    data: any
    status: string
    createdAt: string
    updatedAt: string
    contentType: ContentType
}

export interface EditContentEntryPageProps {
    entry: ContentEntry
}
