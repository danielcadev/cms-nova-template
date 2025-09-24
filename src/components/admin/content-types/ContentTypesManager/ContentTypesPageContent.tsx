'use client'

import { Database, Plus, Settings } from 'lucide-react'
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
          <div className="relative p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-sm theme-text-muted mb-2">Schema</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Content Types
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Define and manage the data structures that power your content. This is the headless
                CMS.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
              <ThemedButton asChild className="w-full sm:w-auto justify-center">
                <Link href="/admin/dashboard/view-content">
                  <Database className="h-4 w-4 mr-2" />
                  View content
                </Link>
              </ThemedButton>
              <ThemedButton
                asChild
                className="theme-card theme-text border theme-border hover:theme-card-hover w-full sm:w-auto justify-center"
              >
                <Link href="/admin/dashboard/content-types/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New type
                </Link>
              </ThemedButton>
            </div>
          </div>
        </div>

        {/* Info: Headless routes and optional templates */}
        <div className="mb-8 p-4 rounded-lg border theme-border theme-card">
          <h3 className="text-sm font-medium theme-text">Headless CMS routes</h3>
          <p className="text-sm theme-text-secondary mt-2">
            Each Content Type is publicly accessible using headless routes:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm theme-text-secondary space-y-1">
            <li>
              Index: <code>/{`[typePath]`}</code> — Lists published entries for the type.
            </li>
            <li>
              Detail:{' '}
              <code>
                /{`[typePath]`}/{`[slug]`}
              </code>{' '}
              — Renders a single published entry.
            </li>
          </ul>
          <p className="text-sm theme-text-secondary mt-3">
            Starter templates like Blog, Plans and Circuits are optional and controlled by feature
            flags in <code>src/lib/config.ts</code>.
          </p>
          <div className="mt-3 text-sm theme-text-secondary">
            For public headless routes, use <code>features.publicTypePaths</code>. You can rely on{' '}
            <code>src/app/[typePath]</code> and <code>src/app/[typePath]/[slug]</code> or create
            custom templates as needed.
          </div>
        </div>

        {/* Content Types List */}
        {displayContentTypes.length > 0 && (
          <div className="space-y-3 mb-8">
            {displayContentTypes.map((contentType) => (
              <div key={contentType.id} className="group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border theme-border theme-card backdrop-blur-sm hover:theme-card-hover transition-colors shadow-sm gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 theme-bg-secondary rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 theme-text-secondary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium theme-text truncate">{contentType.name}</div>
                      <div className="text-sm theme-text-secondary truncate">
                        {contentType.description || 'Custom content type'} •{' '}
                        {contentType.fields?.length || 0} fields
                      </div>
                      <div className="text-xs theme-text-muted font-mono mt-1 truncate">
                        {contentType.apiIdentifier}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ThemedButton
                      size="sm"
                      className="theme-card theme-text border theme-border hover:theme-card-hover"
                      asChild
                    >
                      <Link
                        href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}
                      >
                        <Database className="h-4 w-4 mr-1" />
                        <span className="hidden xs:inline">View entries</span>
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
                        <span className="hidden xs:inline">Edit type</span>
                      </Link>
                    </ThemedButton>
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
