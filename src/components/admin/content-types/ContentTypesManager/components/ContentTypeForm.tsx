'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Database, Loader2, Save, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
import { TemplateHeader } from '@/components/admin/shared/TemplateHeader'
import { PremiumLoading } from '@/components/admin/dashboard/PremiumLoading'
import FieldsBuilder from './FieldsBuilder/index'

const fieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label is required'),
  apiIdentifier: z.string().min(1, 'API identifier is required'),
  type: z.enum(['TEXT', 'RICH_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'MEDIA', 'SLUG', 'SELECT']),
  isRequired: z.boolean().optional(),
  isList: z.boolean().optional(),
  slugRoute: z.string().optional(),
  options: z.string().optional(),
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
  const t = useTranslations('contentTypes.form')
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

  const applyPreset = (presetType: 'seo-article' | 'seo-blog') => {
    if (presetType === 'seo-article') {
      const seoFields = [
        { id: Math.random().toString(36).slice(2, 9), label: 'Title', apiIdentifier: 'title', type: 'TEXT', isRequired: true },
        { id: Math.random().toString(36).slice(2, 9), label: 'Slug', apiIdentifier: 'slug', type: 'SLUG', isRequired: true },
        { id: Math.random().toString(36).slice(2, 9), label: 'Content', apiIdentifier: 'content', type: 'RICH_TEXT', isRequired: true },
        { id: Math.random().toString(36).slice(2, 9), label: 'Meta Title', apiIdentifier: 'metaTitle', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Meta Description', apiIdentifier: 'metaDescription', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Featured Image', apiIdentifier: 'featuredImage', type: 'MEDIA', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Image Alt Text', apiIdentifier: 'imageAlt', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Publish Date', apiIdentifier: 'publishDate', type: 'DATE', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Updated Date', apiIdentifier: 'updatedDate', type: 'DATE', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Is Published', apiIdentifier: 'isPublished', type: 'BOOLEAN', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Category', apiIdentifier: 'category', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Tags', apiIdentifier: 'tags', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Canonical URL', apiIdentifier: 'canonicalUrl', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Is Featured/Pillar', apiIdentifier: 'isFeatured', type: 'BOOLEAN', isRequired: false },
      ]
      setValue('fields', seoFields as any, { shouldDirty: true, shouldValidate: true })
      setValue('name', 'SEO Article', { shouldDirty: true, shouldValidate: true })

      toast({
        title: 'Preset applied',
        description: 'The SEO Article structure has been loaded.',
      })
    } else if (presetType === 'seo-blog') {
      const blogFields = [
        // Core Info
        { id: Math.random().toString(36).slice(2, 9), label: 'Title', apiIdentifier: 'title', type: 'TEXT', isRequired: true },
        {
          id: Math.random().toString(36).slice(2, 9),
          label: 'Slug',
          apiIdentifier: 'slug',
          type: 'SLUG',
          isRequired: true,
          slugRoute: 'Regiones/[regionName]/[subRegionName]/[zonaName]/[slug]' // Added [slug]
        },
        { id: Math.random().toString(36).slice(2, 9), label: 'Main Image', apiIdentifier: 'mainImage', type: 'MEDIA', isRequired: true }, // Changed to MEDIA

        // Content Block 1 (Intro)
        { id: Math.random().toString(36).slice(2, 9), label: 'Introduction (Content 1)', apiIdentifier: 'content1', type: 'RICH_TEXT', isRequired: true },
        { id: Math.random().toString(36).slice(2, 9), label: 'Gallery 1', apiIdentifier: 'image1', type: 'MEDIA', isRequired: false, isList: true }, // List support enabled

        // Content Block 2 (Deep Dive)
        { id: Math.random().toString(36).slice(2, 9), label: 'Deep Dive (Content 2)', apiIdentifier: 'content2', type: 'RICH_TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Gallery 2', apiIdentifier: 'image2', type: 'MEDIA', isRequired: false, isList: true },

        // Content Block 3 (Conclusion)
        { id: Math.random().toString(36).slice(2, 9), label: 'Conclusion (Content 3)', apiIdentifier: 'content3', type: 'RICH_TEXT', isRequired: false },

        // Extra
        { id: Math.random().toString(36).slice(2, 9), label: 'Video URL', apiIdentifier: 'videoUrl', type: 'TEXT', isRequired: false },

        // Classification
        { id: Math.random().toString(36).slice(2, 9), label: 'Región', apiIdentifier: 'regionName', type: 'SELECT', isRequired: false, options: 'Amazonas,Andina,Caribe,Orinoquía,Pacífico,Insular' },
        { id: Math.random().toString(36).slice(2, 9), label: 'Subregión', apiIdentifier: 'subRegionName', type: 'SELECT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Zona', apiIdentifier: 'zonaName', type: 'SELECT', isRequired: false },

        // Standard SEO & Metadata
        { id: Math.random().toString(36).slice(2, 9), label: 'Meta Título', apiIdentifier: 'metaTitle', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Meta Descripción', apiIdentifier: 'metaDescription', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Categoría', apiIdentifier: 'category', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Etiquetas', apiIdentifier: 'tags', type: 'TEXT', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Fecha de Publicación', apiIdentifier: 'publishDate', type: 'DATE', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Fecha de Actualización', apiIdentifier: 'updatedDate', type: 'DATE', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'Publicado', apiIdentifier: 'isPublished', type: 'BOOLEAN', isRequired: false },
        { id: Math.random().toString(36).slice(2, 9), label: 'URL Canónica', apiIdentifier: 'canonicalUrl', type: 'TEXT', isRequired: false },
      ]

      setValue('fields', blogFields as any, { shouldDirty: true, shouldValidate: true })
      setValue('name', 'SEO Blog', { shouldDirty: true, shouldValidate: true })

      toast({
        title: 'Preset applied',
        description: 'The SEO Blog structure has been loaded.',
      })
    }
  }

  const handleFormSubmit = async (data: ContentTypeFormValues) => {
    try {
      setIsSaving(true)

      const result = contentTypeId
        ? await updateContentTypeAction(contentTypeId, data)
        : await createContentTypeAction(data)

      if (result.success) {
        toast({
          title: contentTypeId ? 'Content type updated' : 'Content type created',
          description: result.message || `The content type has been ${contentTypeId ? 'updated' : 'created'} successfully.`,
        })
        router.push('/admin/dashboard/content-types')
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Could not save the content type.',
          variant: 'destructive',
        })
      }
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

  if (isSaving) {
    return (
      <PremiumLoading
        title={contentTypeId ? 'Updating Content Type...' : 'Creating Content Type...'}
        subtitle="This will take just a moment."
      />
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="min-h-screen bg-zinc-50/30 pb-20">
        <TemplateHeader
          title={contentTypeId ? t('editTitle') : t('createTitle')}
          subtitle={contentTypeId ? t('editSubtitle') : t('createSubtitle')}
          backHref="/admin/dashboard/content-types"
          onSave={handleSubmit(handleFormSubmit)}
          isSaving={isSaving}
          saveLabel={contentTypeId ? t('updateButton') : t('createButton')}
        />

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Context Widget */}
          <div className="mb-12 p-8 bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-zinc-900/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-zinc-700/50"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {contentTypeId ? t('contextTitleEdit') : t('contextTitle')}
                </h2>
                <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                  {contentTypeId ? t('contextDescEdit') : t('contextDesc')}
                </p>
              </div>
              <div className="flex items-center gap-4 bg-zinc-800/50 backdrop-blur-sm p-4 rounded-3xl border border-zinc-700/30">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Structure</span>
                  <span className="text-sm font-semibold text-zinc-100">Dynamic Model</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Basic Information */}
              <div className="group relative transition-all duration-500">
                <div className="absolute -inset-4 bg-zinc-100/50 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative bg-white rounded-[2.5rem] border border-zinc-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5">
                  <div className="px-8 py-6 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{t('identityLogic')}</h2>
                      <p className="text-sm text-zinc-500 mt-1 font-medium">{t('identityLogicDesc')}</p>
                    </div>
                    <div className="w-10 h-10 bg-zinc-100/50 rounded-2xl flex items-center justify-center text-zinc-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-8 sm:p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={nameId} className="text-sm font-bold text-zinc-700 ml-1">
                          {t('displayName')}
                        </Label>
                        <Input
                          id={nameId}
                          placeholder={t('displayNamePlaceholder')}
                          {...register('name')}
                          className="h-12 bg-zinc-50/50 border-zinc-200 rounded-2xl focus:ring-zinc-900 focus:border-zinc-900 transition-all font-medium"
                        />
                        {errors.name && <p className="text-xs text-red-500 ml-1 font-medium">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={apiIdentifierId} className="text-sm font-bold text-zinc-700 ml-1">
                          {t('apiIdentifier')}
                        </Label>
                        <Input
                          id={apiIdentifierId}
                          placeholder={t('apiIdentifierPlaceholder')}
                          {...register('apiIdentifier')}
                          className="h-12 bg-zinc-50/50 border-zinc-200 rounded-2xl focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono text-sm"
                        />
                        {errors.apiIdentifier && <p className="text-xs text-red-500 ml-1 font-medium">{errors.apiIdentifier.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={descriptionId} className="text-sm font-bold text-zinc-700 ml-1">
                        Description
                      </Label>
                      <Textarea
                        id={descriptionId}
                        placeholder="What is this content type used for?"
                        {...register('description')}
                        className="min-h-[100px] bg-zinc-50/50 border-zinc-200 rounded-[1.5rem] focus:ring-zinc-900 focus:border-zinc-900 transition-all leading-relaxed font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fields Builder */}
              <div className="group relative transition-all duration-500">
                <div className="absolute -inset-4 bg-zinc-100/50 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative bg-white rounded-[2.5rem] border border-zinc-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5">
                  <div className="px-8 py-6 border-b border-zinc-50 bg-zinc-50/30">
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{t('fieldArchitecture')}</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">{t('fieldArchitectureDesc')}</p>
                  </div>
                  <div className="p-8 sm:p-10">
                    <FieldsBuilder />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Presets Card */}
              <div className="bg-white rounded-[2.5rem] border border-zinc-200/50 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 ml-1">{t('quickTemplates')}</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => applyPreset('seo-article')}
                    className="w-full flex items-start p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-900 hover:text-white group transition-all duration-300 text-left"
                  >
                    <div className="mr-3 mt-0.5 p-2 bg-white rounded-xl text-zinc-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-sm tracking-tight mb-0.5">{t('seoArticle')}</span>
                      <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 leading-normal font-medium">
                        {t('seoArticleDesc')}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('seo-blog')}
                    className="w-full flex items-start p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-900 hover:text-white group transition-all duration-300 text-left"
                  >
                    <div className="mr-3 mt-0.5 p-2 bg-white rounded-xl text-zinc-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-sm tracking-tight mb-0.5">{t('seoBlog')}</span>
                      <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 leading-normal font-medium">
                        {t('seoBlogDesc')}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats/Info Card */}
              <div className="bg-zinc-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-zinc-900/10">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">{t('structureStats')}</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400 font-medium">{t('totalFields')}</span>
                    <span className="text-xl font-bold tracking-tight">{(watch('fields') || []).length}</span>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      {t('structureQuote')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
