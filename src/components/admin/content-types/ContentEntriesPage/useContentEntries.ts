import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentType, ContentEntry, Field } from './data'

export function useContentEntries(contentType: ContentType) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const router = useRouter()

    const filteredEntries = contentType.entries.filter((entry) => {
        const matchesSearch =
            searchTerm === '' ||
            Object.values(entry.data).some((value) => {
                // Handle different value types for search
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchTerm.toLowerCase())
                }
                if (typeof value === 'number') {
                    return String(value).includes(searchTerm)
                }
                if (typeof value === 'object' && value !== null) {
                    // Search in object properties
                    const v = value as any
                    if (v.title) return String(v.title).toLowerCase().includes(searchTerm.toLowerCase())
                    if (v.name) return String(v.name).toLowerCase().includes(searchTerm.toLowerCase())
                    if (v.label) return String(v.label).toLowerCase().includes(searchTerm.toLowerCase())
                }
                return false
            })

        const matchesStatus = statusFilter === 'all' || entry.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Helper to get display value if needed (internal logic mostly, but exposed if UI needs specific formatting)
    const getDisplayValue = (entry: ContentEntry, field: Field) => {
        const value = entry.data[field.apiIdentifier]
        if (!value) return '-'

        // Handle different field types
        if (field.type === 'RICH_TEXT') {
            if (typeof value === 'string') {
                // Extract plain text from HTML
                const div = document.createElement('div')
                div.innerHTML = value
                return `${div.textContent?.slice(0, 100)}...` || '-'
            }
            return '-'
        }

        if (field.type === 'MEDIA') {
            // Handle media objects
            if (typeof value === 'object' && value !== null) {
                return (value as any).url ? '📷 Image' : '-'
            }
            return '-'
        }

        if (field.type === 'BOOLEAN') {
            return value ? '✅' : '❌'
        }

        if (field.type === 'DATE') {
            try {
                return new Date(value as string).toLocaleDateString()
            } catch {
                return '-'
            }
        }

        // Handle arrays and objects
        if (Array.isArray(value)) {
            return `${value.length} items`
        }

        if (typeof value === 'object' && value !== null) {
            const v = value as any
            // For objects, try to find a meaningful display value
            if (v.title) return String(v.title)
            if (v.name) return String(v.name)
            if (v.label) return String(v.label)
            return '[Object]'
        }

        // Handle primitive values
        const stringValue = String(value)
        return stringValue.slice(0, 50) + (stringValue.length > 50 ? '...' : '')
    }

    const handleDelete = async (entryId: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return

        try {
            const response = await fetch(
                `/api/content-types/${contentType.apiIdentifier}/entries/${entryId}`,
                {
                    method: 'DELETE',
                },
            )

            if (response.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Error deleting entry:', error)
        }
    }

    // Get the first field as title field
    const getTitleField = () => {
        return (
            contentType.fields.find(
                (f) =>
                    f.apiIdentifier.toLowerCase().includes('title') ||
                    f.apiIdentifier.toLowerCase().includes('name') ||
                    f.type === 'TEXT',
            ) || contentType.fields[0]
        )
    }

    const getEntryTitle = (entry: ContentEntry) => {
        const titleField = getTitleField()
        if (!titleField) return `Entry #${entry.id.slice(-6)}`

        const value = entry.data[titleField.apiIdentifier]

        // Handle different value types
        if (!value) return `Untitled ${contentType.name}`

        if (typeof value === 'string') return value

        if (typeof value === 'object' && value !== null) {
            const v = value as any
            // For objects, try to find a meaningful display value
            if (v.title) return String(v.title)
            if (v.name) return String(v.name)
            if (v.label) return String(v.label)
            return `Untitled ${contentType.name}`
        }

        return String(value) || `Untitled ${contentType.name}`
    }

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredEntries,
        handleDelete,
        getEntryTitle,
        getDisplayValue, // Exported in case needed
    }
}
