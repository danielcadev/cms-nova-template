'use client'

import { Edit, Eye, Plus, Settings, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface ContentType {
  id: string
  name: string
  slug: string
  description?: string
  fields: Array<{
    id: string
    label: string
    type: string
    isRequired: boolean
  }>
  _count: {
    entries: number
  }
}

interface ContentTypeDetailProps {
  slug: string
}

export function ContentTypeDetail({ slug }: ContentTypeDetailProps) {
  const t = useTranslations('contentTypes')
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const loadContentType = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content-types/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setContentType(data)
      } else {
        toast({
          title: t('common.error'),
          description: t('error.notFound'),
          variant: 'destructive',
        })
        router.push('/admin/dashboard/content-types')
      }
    } catch (error) {
      console.error('Error loading content type:', error)
      toast({
        title: t('common.error'),
        description: t('error.failed'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [router, slug, toast])

  useEffect(() => {
    loadContentType()
  }, [loadContentType])

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
          {t('error.notFound')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('error.notFoundDesc')}
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
            {contentType.description || t('card.noDescription')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/dashboard/content-types/${slug}/content`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {t('detail.viewContent', { count: contentType._count.entries })}
          </Button>
          <Button
            onClick={() => router.push(`/admin/dashboard/content-types/${slug}/content/create`)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('detail.addEntry')}
          </Button>
        </div>
      </div>

      {/* Content Type Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('detail.stats.totalEntries')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentType._count.entries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('detail.stats.fields')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentType.fields.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('detail.stats.slug')}</CardTitle>
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
          <CardTitle>{t('detail.fieldsList.title')}</CardTitle>
          <CardDescription>{t('detail.fieldsList.description')}</CardDescription>
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
                    <h4 className="font-medium">{field.label}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('detail.fieldsList.type', { type: field.type })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {field.isRequired && <Badge variant="secondary">{t('detail.fieldsList.required')}</Badge>}
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
                {t('detail.fieldsList.noFields')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {t('detail.actions.edit')}
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          {t('detail.actions.delete')}
        </Button>
      </div>
    </div>
  )
}
