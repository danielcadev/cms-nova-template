'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  createContentTypeAction,
  updateContentTypeAction,
} from '@/app/actions/content-type-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { toCamelCase } from '@/utils/formatters'
import FieldsBuilder from '../FieldsBuilder/index'

const fieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label is required'),
  apiIdentifier: z.string().min(1, 'API identifier is required'),
  type: z.enum(['TEXT', 'RICH_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'MEDIA']),
  isRequired: z.boolean().default(false),
})

const contentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  apiIdentifier: z.string().min(1, 'API identifier is required'),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, 'Must have at least one field'),
})

export type ContentTypeFormValues = z.infer<typeof contentTypeSchema>

interface ContentTypeFormProps {
  initialData?: Partial<ContentTypeFormValues>
  contentTypeId?: string
  isLoading?: boolean
}

export default function ContentTypeForm({
  initialData,
  contentTypeId,
  isLoading,
}: ContentTypeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const nameId = useId()
  const apiIdentifierId = useId()
  const descriptionId = useId()

  const methods = useForm<ContentTypeFormValues>({
    resolver: zodResolver(contentTypeSchema),
    defaultValues: {
      name: initialData?.name || '',
      apiIdentifier: initialData?.apiIdentifier || '',
      description: initialData?.description || '',
      fields: initialData?.fields || [],
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods
  const nameValue = watch('name')

  // Auto-generate API identifier from name
  useEffect(() => {
    if (nameValue && !initialData?.apiIdentifier) {
      setValue('apiIdentifier', toCamelCase(nameValue), { shouldValidate: true })
    }
  }, [nameValue, setValue, initialData?.apiIdentifier])

  const handleFormSubmit = async (data: ContentTypeFormValues) => {
    try {
      setIsSaving(true)

      const submitAction = contentTypeId
        ? (d: ContentTypeFormValues) => updateContentTypeAction(contentTypeId!, d)
        : createContentTypeAction

      await submitAction(data)

      toast({
        title: contentTypeId ? 'Content type updated' : 'Content type created',
        description: `The content type has been ${contentTypeId ? 'updated' : 'created'} successfully.`,
      })

      router.push('/admin/dashboard/content-types')
    } catch (error) {
      console.error('Error saving content type:', error)
      toast({
        title: 'Error',
        description: 'Could not save the content type.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Basic Information</h2>
                <p className="text-sm text-zinc-500">
                  Define the core identity of this content type.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor={nameId} className="text-zinc-900 font-medium mb-2 block">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={nameId}
                    placeholder="e.g. Blog Posts, Products, News"
                    {...register('name', { required: 'Name is required' })}
                    className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={apiIdentifierId} className="text-zinc-900 font-medium mb-2 block">
                    API Identifier <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={apiIdentifierId}
                    placeholder="e.g. blogPosts, products, news"
                    {...register('apiIdentifier', { required: 'API identifier is required' })}
                    className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 font-mono text-sm"
                  />
                  {errors.apiIdentifier && (
                    <p className="text-sm text-red-600 mt-1">{errors.apiIdentifier.message}</p>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    Used in API calls. Auto-generated from name but can be customized.
                  </p>
                </div>

                <div>
                  <Label htmlFor={descriptionId} className="text-zinc-900 font-medium mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id={descriptionId}
                    placeholder="Describe what type of content this structure will store..."
                    {...register('description')}
                    className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none h-24"
                  />
                </div>
              </div>
            </div>

            {/* Fields Builder */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Content Fields</h2>
                <p className="text-sm text-zinc-500">
                  Drag and drop fields to build your content structure.
                </p>
              </div>
              <FieldsBuilder />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm sticky top-6">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">
                Actions
              </h3>
              <div className="space-y-4">
                <Button
                  onClick={handleSubmit(handleFormSubmit)}
                  disabled={isSaving || isLoading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Content Type'}
                </Button>
                <p className="text-xs text-center text-zinc-500">
                  Make sure to save your changes before leaving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
