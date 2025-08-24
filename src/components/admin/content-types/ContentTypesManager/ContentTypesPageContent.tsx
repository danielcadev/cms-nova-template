'use client'

import { ArrowRight, Database, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { ThemedButton } from '@/components/ui/ThemedButton'

interface ContentType {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  fields: any[]
  createdAt: string
  updatedAt: string
}

interface ContentTypesPageContentProps {
  contentTypes: ContentType[]
  loading: boolean
  error: string | null
  searchTerm: string
  onSearchChange: (term: string) => void
  filteredContentTypes: ContentType[]
}

export function ContentTypesPageContent({
  loading,
  error,
  filteredContentTypes,
  searchTerm,
  onSearchChange,
}: ContentTypesPageContentProps) {
  const [searchValue, setSearchValue] = useState(searchTerm)

  const _handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }

  if (loading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title="Content Types"
          message="Loading your content types..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Loading error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const displayContentTypes = filteredContentTypes

  return (
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-8 py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div>
              <p className="text-sm theme-text-muted mb-2">Schema</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Content Types
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Define and manage the data structures that power your content.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemedButton asChild>
                <Link href="/admin/dashboard/view-content">
                  <Database className="h-4 w-4 mr-2" />
                  View content
                </Link>
              </ThemedButton>
              <ThemedButton
                asChild
                className="theme-card theme-text border theme-border hover:theme-card-hover"
              >
                <Link href="/admin/dashboard/content-types/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New type
                </Link>
              </ThemedButton>
            </div>
          </div>
        </div>

        {/* Search removed by request */}

        {/* Content Types List */}
        {displayContentTypes.length > 0 && (
          <div className="space-y-3 mb-8">
            {displayContentTypes.map((contentType) => (
              <div key={contentType.id} className="group">
                <div className="flex items-center justify-between p-4 rounded-lg border theme-border theme-card backdrop-blur-sm hover:theme-card-hover transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 theme-bg-secondary rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 theme-text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium theme-text">{contentType.name}</div>
                      <div className="text-sm theme-text-secondary">
                        {contentType.description || 'Custom content type'} •{' '}
                        {contentType.fields?.length || 0} fields
                      </div>
                      <div className="text-xs theme-text-muted font-mono mt-1">
                        {contentType.apiIdentifier}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemedButton
                      size="sm"
                      className="theme-card theme-text border theme-border hover:theme-card-hover"
                      asChild
                    >
                      <Link
                        href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}
                      >
                        <Database className="h-4 w-4 mr-1" />
                        View entries
                      </Link>
                    </ThemedButton>
                    <ThemedButton
                      size="sm"
                      className="theme-card theme-text border theme-border hover:theme-card-hover"
                      asChild
                    >
                      <Link
                        href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/edit`}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Edit type
                      </Link>
                    </ThemedButton>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {displayContentTypes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No content types found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {searchValue
                ? `No content types match "${searchValue}"`
                : 'Create your first content type to start structuring your information'}
            </p>
            {!searchValue && (
              <ThemedButton
                className="theme-card theme-text border theme-border hover:theme-card-hover"
                asChild
              >
                <Link href="/admin/dashboard/content-types/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create content type
                </Link>
              </ThemedButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
