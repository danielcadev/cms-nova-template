'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
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
  // cleaned noisy debug logs

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
        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSaving || isLoading}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Content Type'}
          </Button>
        </div>

        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor={nameId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </Label>
                <Input
                  id={nameId}
                  placeholder="e.g. Blog Posts, Products, News"
                  {...register('name', { required: 'Name is required' })}
                  className="mt-1 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor={apiIdentifierId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  API Identifier
                </Label>
                <Input
                  id={apiIdentifierId}
                  placeholder="e.g. blogPosts, products, news"
                  {...register('apiIdentifier', { required: 'API identifier is required' })}
                  className="mt-1 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                />
                {errors.apiIdentifier && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.apiIdentifier.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor={descriptionId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id={descriptionId}
                  placeholder="Describe what type of content this structure will store..."
                  {...register('description')}
                  className="mt-1 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 resize-none h-20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fields Builder */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Fields</h2>
          <FieldsBuilder />
        </div>
      </form>
    </FormProvider>
  )
}
