'use client'

import { ArrowLeft, Calendar, Edit, FileText, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ThemedButton } from '@/components/ui/ThemedButton'

interface ContentType {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  fields: Field[]
  entries: ContentEntry[]
}

interface Field {
  id: string
  label: string
  apiIdentifier: string
  type: string
  isRequired: boolean
}

interface ContentEntry {
  id: string
  data: any
  status: string
  createdAt: string
  updatedAt: string
}

interface ContentEntriesPageProps {
  contentType: ContentType
}

export function ContentEntriesPage({ contentType }: ContentEntriesPageProps) {
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
          if (value.title)
            return String(value.title).toLowerCase().includes(searchTerm.toLowerCase())
          if (value.name) return String(value.name).toLowerCase().includes(searchTerm.toLowerCase())
          if (value.label)
            return String(value.label).toLowerCase().includes(searchTerm.toLowerCase())
        }
        return false
      })

    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const _getDisplayValue = (entry: ContentEntry, field: Field) => {
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
        return value.url ? '📷 Image' : '-'
      }
      return '-'
    }

    if (field.type === 'BOOLEAN') {
      return value ? '✅' : '❌'
    }

    if (field.type === 'DATE') {
      try {
        return new Date(value).toLocaleDateString()
      } catch {
        return '-'
      }
    }

    // Handle arrays and objects
    if (Array.isArray(value)) {
      return `${value.length} items`
    }

    if (typeof value === 'object' && value !== null) {
      // For objects, try to find a meaningful display value
      if (value.title) return String(value.title)
      if (value.name) return String(value.name)
      if (value.label) return String(value.label)
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
      // For objects, try to find a meaningful display value
      if (value.title) return String(value.title)
      if (value.name) return String(value.name)
      if (value.label) return String(value.label)
      return `Untitled ${contentType.name}`
    }

    return String(value) || `Untitled ${contentType.name}`
  }

  return (
    <div className="min-h-screen theme-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">
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
              <div key={entry.id} className="group">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {getEntryTitle(entry)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.status === 'published'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                              : entry.status === 'draft'
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {entry.status === 'published'
                            ? 'Published'
                            : entry.status === 'draft'
                              ? 'Draft'
                              : 'Archived'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemedButton
                      variantTone="ghost"
                      size="sm"
                      asChild
                      className="theme-text-secondary hover:theme-text"
                    >
                      <Link
                        href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/edit/${entry.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1 theme-text-secondary" /> Edit entry
                      </Link>
                    </ThemedButton>
                    <ThemedButton
                      variantTone="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </ThemedButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
