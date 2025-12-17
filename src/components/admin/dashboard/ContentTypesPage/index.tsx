'use client'

import { ContentTypesPageContent } from '@/components/admin/content-types/ContentTypesManager/ContentTypesPageContent'
import type { ContentTypesPageProps } from './data'
import { useContentTypesPage } from './hooks/useContentTypesPage'

export function ContentTypesPage({ initialContentTypes }: ContentTypesPageProps) {
  const {
    loading,
    error,
    contentTypes,
    searchTerm,
    handleSearchChange,
    filteredContentTypes,
  } = useContentTypesPage(initialContentTypes)

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
