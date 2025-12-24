export interface Field {
    id: string
    label: string
    apiIdentifier: string
    type: string
    isRequired: boolean
}

export interface DynamicFieldRendererProps {
    field: Field
    value: any
    onChange: (value: any) => void
    variant?: 'default' | 'compact'
    fieldId?: string
    onAutoGenerate?: () => void
}

export interface ImageDropZoneProps {
    fieldId: string
    isUploading: boolean
    onFileSelect: (file: File) => void
    variant?: 'default' | 'compact'
}
