'use client'

import { MapPin, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface TourismTemplate {
  id: string
  title: string
  slug: string
  description: string
  destination: string
  duration: string
  price: number
  category: string
  status: 'draft' | 'published'
  features: string[]
  images: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
    activities: string[]
  }>
  createdAt: string
  updatedAt: string
}

interface EditTourismTemplateProps {
  templateId: string
}

export function EditTourismTemplate({ templateId }: EditTourismTemplateProps) {
  const [template, setTemplate] = useState<TourismTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<TourismTemplate>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const loadTemplate = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/templates/tourism/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate(data)
        setFormData(data)
      } else {
        toast({
          title: 'Error',
          description: 'Tourism template not found',
          variant: 'destructive',
        })
        router.push('/admin/dashboard/templates/tourism')
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast({
        title: 'Error',
        description: 'Failed to load tourism template',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [router, templateId, toast])

  useEffect(() => {
    loadTemplate()
  }, [loadTemplate])

  // Generate stable IDs for inputs (must be before any early returns)
  const titleId = useId()
  const slugId = useId()
  const descId = useId()
  const destId = useId()
  const durationId = useId()
  const priceId = useId()
  const categoryId = useId()

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayChange = (name: string, index: number, value: string) => {
    setFormData((prev) => {
      const array = [...((prev[name as keyof TourismTemplate] as string[]) || [])]
      array[index] = value
      return {
        ...prev,
        [name]: array,
      }
    })
  }

  const addArrayItem = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...((prev[name as keyof TourismTemplate] as string[]) || []), ''],
    }))
  }

  const removeArrayItem = (name: string, index: number) => {
    setFormData((prev) => {
      const array = [...((prev[name as keyof TourismTemplate] as string[]) || [])]
      array.splice(index, 1)
      return {
        ...prev,
        [name]: array,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!template) return

    // Validate required fields
    const errors: string[] = []

    if (!formData.title?.trim()) {
      errors.push('Title is required')
    }

    if (!formData.slug?.trim()) {
      errors.push('Slug is required')
    }

    if (!formData.destination?.trim()) {
      errors.push('Destination is required')
    }

    if (!formData.price || formData.price <= 0) {
      errors.push('Valid price is required')
    }

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
      const response = await fetch(`/api/templates/tourism/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Tourism template updated successfully',
        })
        loadTemplate() // Reload to get updated data
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to update tourism template',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to update tourism template',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/templates/tourism/${templateId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Tourism template deleted successfully',
        })
        router.push('/admin/dashboard/templates/tourism')
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete tourism template',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete tourism template',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
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

  if (!template) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Tourism template not found
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Delete Button */}
      <div className="flex justify-end">
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
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Basic details for your tourism template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={titleId}>Title *</Label>
                <Input
                  id={titleId}
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={slugId}>Slug *</Label>
                <Input
                  id={slugId}
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="enter-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={descId}>Description</Label>
              <Textarea
                id={descId}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
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

        {/* Tourism Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Tourism Details
            </CardTitle>
            <CardDescription>Specific details for the tourism package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={destId}>Destination *</Label>
                <Input
                  id={destId}
                  value={formData.destination || ''}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="Enter destination"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={durationId}>Duration</Label>
                <Input
                  id={durationId}
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 7 days 6 nights"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={priceId}>Price *</Label>
                <Input
                  id={priceId}
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={categoryId}>Category</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(val) => handleInputChange('category', val)}
              >
                <SelectTrigger id={categoryId}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Key features and highlights of this tourism package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.features || []).map((feature, index) => (
              <div key={feature} className="flex items-center gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder="Enter feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('features', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem('features')}>
              Add Feature
            </Button>
          </CardContent>
        </Card>

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
