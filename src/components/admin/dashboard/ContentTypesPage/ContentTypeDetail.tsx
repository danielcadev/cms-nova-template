'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Settings, Eye, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ContentType {
  id: string
  name: string
  slug: string
  description?: string
  fields: Array<{
    id: string
    name: string
    type: string
    required: boolean
  }>
  _count: {
    entries: number
  }
}

interface ContentTypeDetailProps {
  slug: string
}

export function ContentTypeDetail({ slug }: ContentTypeDetailProps) {
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadContentType()
  }, [slug])

  const loadContentType = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content-types/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setContentType(data)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!contentType) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Content type not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The content type you're looking for doesn't exist.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {contentType.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {contentType.description || 'No description provided'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/dashboard/content-types/${slug}/content`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Content ({contentType._count.entries})
          </Button>
          <Button
            onClick={() => router.push(`/admin/dashboard/content-types/${slug}/content/create`)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Content Type Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentType._count.entries}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentType.fields.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Slug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {contentType.slug}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Fields</CardTitle>
          <CardDescription>
            Fields defined for this content type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentType.fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium">{field.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type: {field.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {field.required && (
                    <Badge variant="secondary">Required</Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {contentType.fields.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No fields defined yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Edit Content Type
        </Button>
        <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
          Delete Content Type
        </Button>
      </div>
    </div>
  )
}