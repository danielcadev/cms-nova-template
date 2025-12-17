'use client'

import { ArrowLeft, FileText, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { EntryRow } from './EntryRow'
import type { ContentEntriesPageProps } from './data'
import { useContentEntries } from './useContentEntries'

export function ContentEntriesPage({ contentType }: ContentEntriesPageProps) {
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredEntries, handleDelete, getEntryTitle } =
    useContentEntries(contentType)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/admin/dashboard/content-types"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Content Types
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {contentType.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {contentType.description || `Manage ${contentType.name} entries`}
            </p>
          </div>

          <ThemedButton
            asChild
            className="theme-card theme-text border theme-border hover:theme-card-hover"
          >
            <Link
              href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/create`}
            >
              <Plus className="h-4 w-4 mr-2" />
              New {contentType.name}
            </Link>
          </ThemedButton>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 rounded-lg"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-4 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Content List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No entries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {searchTerm
              ? `No entries match "${searchTerm}"`
              : `Start by creating your first ${contentType.name} entry`}
          </p>
          {!searchTerm && (
            <ThemedButton
              asChild
              className="theme-card theme-text border theme-border hover:theme-card-hover"
            >
              <Link
                href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/create`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create {contentType.name}
              </Link>
            </ThemedButton>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              contentType={contentType}
              getEntryTitle={getEntryTitle}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
