'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Basic schema for dynamic content
const dynamicContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
})

type DynamicContentFormData = z.infer<typeof dynamicContentSchema>

interface DynamicContentFormProps {
  initialData?: Partial<DynamicContentFormData>
  onSubmit: (data: DynamicContentFormData) => void
  isLoading?: boolean
  contentTypeId?: string
}

export function DynamicContentForm({
  initialData,
  onSubmit,
  isLoading = false,
}: DynamicContentFormProps) {
  const titleId = useId()
  const slugId = useId()
  const contentId = useId()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<DynamicContentFormData>({
    resolver: zodResolver(dynamicContentSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      slug: initialData?.slug || '',
    },
  })

  const title = watch('title')

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor={titleId}>Title</Label>
              <Input
                id={titleId}
                {...register('title')}
                placeholder="Enter content title"
                className="mt-1"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor={slugId}>Slug</Label>
              <Input
                id={slugId}
                {...register('slug')}
                placeholder="content-slug"
                className="mt-1"
              />
              {title && (
                <p className="text-xs text-gray-500 mt-1">Suggested: {generateSlug(title)}</p>
              )}
              {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <Label htmlFor={contentId}>Content</Label>
              <Textarea
                id={contentId}
                {...register('content')}
                placeholder="Enter your content here..."
                rows={10}
                className="mt-1"
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={isLoading || !isDirty} className="min-w-[120px]">
              {isLoading ? 'Saving...' : 'Save Content'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
