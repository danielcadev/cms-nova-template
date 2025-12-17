'use client'

import { ArrowLeft, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ContentEntriesPageProps } from './data'
import { useContentEntries } from './hooks/useContentEntries'

export function ContentEntriesPage({ contentTypeSlug }: ContentEntriesPageProps) {
  const {
    entries,
    loading,
    searchTerm,
    setSearchTerm,
    handleDeleteEntry,
    filteredEntries,
    router,
  } = useContentEntries(contentTypeSlug)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }, () => (
            <div
              key={crypto.randomUUID()}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/dashboard/content-types/${contentTypeSlug}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {contentTypeSlug}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {contentTypeSlug} Content
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your {contentTypeSlug} content entries
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content/create`)
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Entry
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {entries.filter((e) => e.status === 'published').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {entries.filter((e) => e.status === 'draft').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                entries.filter((e) => {
                  if (!e.createdAt) return false
                  const entryDate = new Date(e.createdAt)
                  const now = new Date()
                  return (
                    entryDate.getMonth() === now.getMonth() &&
                    entryDate.getFullYear() === now.getFullYear()
                  )
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Content Entries</CardTitle>
          <CardDescription>
            {filteredEntries.length} of {entries.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{entry.title}</h3>
                    <Badge variant={entry.status === 'published' ? 'default' : 'secondary'}>
                      {entry.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Slug: {entry.slug}</span>
                    {entry.author && <span>By: {entry.author.name}</span>}
                    {entry.updatedAt && (
                      <span>Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/admin/dashboard/content-types/${contentTypeSlug}/content/${entry.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/content/${entry.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {searchTerm ? 'No entries found' : 'No entries yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Create your first content entry to get started'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() =>
                      router.push(
                        `/admin/dashboard/content-types/${contentTypeSlug}/content/create`,
                      )
                    }
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Entry
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
