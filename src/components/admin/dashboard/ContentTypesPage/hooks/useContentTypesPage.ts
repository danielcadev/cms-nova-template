import { useEffect, useState } from 'react'
import type { ContentTypeData } from '../data'

export function useContentTypesPage(initialContentTypes: ContentTypeData[]) {
    const [loading, setLoading] = useState(true)
    const [error] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [contentTypes] = useState(initialContentTypes)

    // Short themed splash on client-side navigation (keeps parity with Templates)
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 300)
        return () => clearTimeout(t)
    }, [])

    // Filtrar content types
    const filteredContentTypes = contentTypes.filter(
        (ct) =>
            ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ct.apiIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ct.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSearchChange = (term: string) => {
        setSearchTerm(term)
    }

    return {
        loading,
        error,
        contentTypes,
        searchTerm,
        filteredContentTypes,
        handleSearchChange,
    }
}
