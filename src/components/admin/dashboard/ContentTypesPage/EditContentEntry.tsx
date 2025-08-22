'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ContentEntry {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  data: Record<string, any>
  contentType: {
    id: string
    name: string
    slug: string
    fields: Array<{
      id: string
      name: string
      type: string
      required: boolean
      options?: string[]
    }>
  }
}

interface EditContentEntryProps {
  contentTypeSlug: string
  entryId: string
}

export function EditContentEntry({ contentTypeSlug, entryId }: EditContentEntryProps) {
  const [entry, setEntry] = useState<ContentEntry | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadEntry()
  }, [contentTypeSlug, entryId])

  const loadEntry = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`)
      if (response.ok) {
        const data = await response.json()
        setEntry(data)
        
        // Initialize form data
        setFormData({
          title: data.title,
          slug: data.slug,
          status: data.status,
          ...data.data
        })
      } else {
        toast({
          title: 'Error',
          description: 'Content entry not found',
          variant: 'destructive',
        })
        router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)
      }
    } catch (error) {
      console.error('Error loading entry:', error)
      toast({
        title: 'Error',
        description: 'Failed to load content entry',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!entry) return

    // Validate required fields
    const errors: string[] = []
    
    if (!formData.title?.trim()) {
      errors.push('Title is required')
    }
    
    if (!formData.slug?.trim()) {
      errors.push('Slug is required')
    }
    
    entry.contentType.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors.push(`${field.name} is required`)
      }
    })
    
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Content entry updated successfully',
        })
        loadEntry() // Reload to get updated data
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to update content entry',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error updating entry:', error)
      toast({
        title: 'Error',
        description: 'Failed to update content entry',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Content entry deleted successfully',
        })
        router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete content entry',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete content entry',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  const renderField = (field: any) => {
    const value = formData[field.name] || ''
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name}`}
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name}`}
            rows={4}
          />
        )
      
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handleInputChange(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'boolean':
        return (
          <Select
            value={value ? 'true' : 'false'}
            onValueChange={(val) => handleInputChange(field.name, val === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        )
      
      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name}`}
          />
        )
    }
  }

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
            <p className="text-gray-500 dark:text-gray-400">
              Edit {contentTypeSlug} content entry
            </p>
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
            <CardDescription>
              Basic details for your content entry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
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
        {entry.contentType.fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Content Fields</CardTitle>
              <CardDescription>
                Custom fields for this content type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entry.contentType.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.name} {field.required && '*'}
                  </Label>
                  {renderField(field)}
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
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}