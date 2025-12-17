'use client'

import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EntryForm } from './components/EntryForm'
import type { EditContentEntryProps } from './data'
import { useEditContentEntry } from './hooks/useEditContentEntry'

export function EditContentEntry({ contentTypeSlug, entryId }: EditContentEntryProps) {
  const {
    entry,
    formData,
    loading,
    saving,
    deleting,
    titleInputId,
    slugInputId,
    handleInputChange,
    handleSubmit,
    handleDelete,
    router,
  } = useEditContentEntry(contentTypeSlug, entryId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Content entry not found
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {contentTypeSlug} Content
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit {entry?.title || 'Entry'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Edit {contentTypeSlug} content entry</p>
          </div>
        </div>
        {/* Delete Button */}
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Basic details for your content entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={titleInputId}>Title *</Label>
                <Input
                  id={titleInputId}
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={slugInputId}>Slug *</Label>
                <Input
                  id={slugInputId}
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="enter-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'draft'}
                onValueChange={(val) => handleInputChange('status', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Fields */}
        {entry.contentType && entry.contentType.fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Content Fields</CardTitle>
              <CardDescription>Custom fields for this content type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entry.contentType.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.name} {field.required && '*'}
                  </Label>
                  <EntryForm
                    field={field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
