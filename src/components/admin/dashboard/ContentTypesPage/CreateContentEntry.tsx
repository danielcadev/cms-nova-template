'use client'

import { Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
import type { CreateContentEntryProps } from './data'
import { useCreateContentEntry } from './hooks/useCreateContentEntry'

export function CreateContentEntry({ contentTypeSlug }: CreateContentEntryProps) {
  const {
    contentType,
    formData,
    loading,
    saving,
    titleInputId,
    slugInputId,
    handleInputChange,
    handleSubmit,
    router,
  } = useCreateContentEntry(contentTypeSlug)
  const t = useTranslations('createEntry')

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
          {t('notFound')}
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
            <CardTitle>{t('basicInfo.title')}</CardTitle>
            <CardDescription>{t('basicInfo.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={titleInputId}>{t('basicInfo.titleLabel')} *</Label>
                <Input
                  id={titleInputId}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={t('basicInfo.titlePlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={slugInputId}>{t('basicInfo.slugLabel')} *</Label>
                <Input
                  id={slugInputId}
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder={t('basicInfo.slugPlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleInputChange('status', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('statusOptions.draft')}</SelectItem>
                  <SelectItem value="published">{t('statusOptions.published')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Fields */}
        {contentType.fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('additionalProperties.title')}</CardTitle>
              <CardDescription>{t('additionalProperties.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentType.fields.map((field) => (
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
            {saving ? t('creating') : t('create')}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t('cancel')}
          </Button>
        </div>
      </form>
    </div>
  )
}
