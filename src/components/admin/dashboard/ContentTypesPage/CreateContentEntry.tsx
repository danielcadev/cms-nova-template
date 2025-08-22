'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ContentType {
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

interface CreateContentEntryProps {
  contentTypeSlug: string
}

export function CreateContentEntry({ contentTypeSlug }: CreateContentEntryProps) {
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    slug: '',
    status: 'draft'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadContentType()
  }, [contentTypeSlug])

  const loadContentType = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content-types/${contentTypeSlug}`)
      if (response.ok) {
        const data = await response.json()
        setContentType(data)
        
        // Initialize form data with default values
        const initialData: Record<string, any> = {
          title: '',
          slug: '',
          status: 'draft'
        }
        
        data.fields.forEach((field: any) => {
          initialData[field.name] = field.type === 'boolean' ? false : ''
        })
        
        setFormData(initialData)
      } else {
        toast({
          title: 'Error',
          description: 'Content type not found',
          variant: 'destructive',
        })
        router.push('/admin/dashboard/content-types')
      }
    } catch (error) {
      console.error('Error loading content type:', error)
      toast({
        title: 'Error',
        description: 'Failed to load content type',
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
    
    // Auto-generate slug from title
    if (name === 'title' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contentType) return

    // Validate required fields
    const errors: string[] = []
    
    if (!formData.title.trim()) {
      errors.push('Title is required')
    }
    
    if (!formData.slug.trim()) {
      errors.push('Slug is required')
    }
    
    contentType.fields.forEach(field => {
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
      const response = await fetch(`/api/content-types/${contentTypeSlug}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Content entry created successfully',
        })
        router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to create content entry',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating entry:', error)
      toast({
        title: 'Error',
        description: 'Failed to create content entry',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
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

  if (!contentType) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Content type not found
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="enter-slug"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
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
        {contentType.fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Content Fields</CardTitle>
              <CardDescription>
                Custom fields for this content type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentType.fields.map((field) => (
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
            {saving ? 'Creating...' : 'Create Entry'}
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