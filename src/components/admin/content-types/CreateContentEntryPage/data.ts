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

export interface CreateContentEntryPageProps {
    contentType: ContentType
}
