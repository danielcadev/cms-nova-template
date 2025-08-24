'use client'

import { useEffect, useState } from 'react'
import { ContentTypesPageContent } from '@/components/admin/content-types/ContentTypesManager/ContentTypesPageContent'

interface ContentTypeData {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  fields: any[]
  createdAt: string
  updatedAt: string
}

interface ContentTypesPageProps {
  initialContentTypes: ContentTypeData[]
}

export function ContentTypesPage({ initialContentTypes }: ContentTypesPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)
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

  return (
    <ContentTypesPageContent
      contentTypes={contentTypes}
      loading={loading}
      error={error}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      filteredContentTypes={filteredContentTypes}
    />
  )
}

export { ContentEntriesPage } from './ContentEntriesPage'
// Export new components
export { ContentTypeDetail } from './ContentTypeDetail'
export { CreateContentEntry } from './CreateContentEntry'
export { EditContentEntry } from './EditContentEntry'
