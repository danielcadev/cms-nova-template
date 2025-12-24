'use client'

import { TemplateHeader } from '@/components/admin/dashboard/TemplatesPage/TemplateHeader'
import { Plus, Search, FileCode } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EntryRow } from './EntryRow'
import type { ContentEntriesPageProps } from './data'
import { useContentEntries } from './useContentEntries'

export function ContentEntriesPage({ contentType }: ContentEntriesPageProps) {
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredEntries, handleDelete, getEntryTitle } =
    useContentEntries(contentType)

  return (
    <div className="min-h-screen bg-white">
      <TemplateHeader
        title={contentType.name}
        subtitle={contentType.description || `Manage ${contentType.name} entries`}
        backHref="/admin/dashboard/content-types"
        rightActions={
          <Button
            asChild
            className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
          >
            <Link href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/create`}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Link>
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Search and Filter */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-zinc-200 focus:ring-zinc-900/10 focus:border-zinc-900 rounded-xl h-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-zinc-200 rounded-xl bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all cursor-pointer hover:border-zinc-300"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Content List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100">
              <FileCode className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              No entries found
            </h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
              {searchTerm
                ? `No entries match "${searchTerm}"`
                : `Start by creating your first ${contentType.name} entry`}
            </p>
            {!searchTerm && (
              <Button
                asChild
                className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
              >
                <Link
                  href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/create`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create {contentType.name}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 pb-20">
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
    </div>
  )
}
