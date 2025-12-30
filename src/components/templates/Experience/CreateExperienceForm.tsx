'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

import { createExperienceAction, updateExperienceAction } from '@/app/actions/experience-actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
import { PremiumLoading } from '@/components/admin/dashboard/PremiumLoading'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useS3Config } from '@/hooks/use-s3-config'
import { useToast } from '@/hooks/use-toast'
import {
  DAY_OPTIONS,
  DURATION_TYPES,
  type ExperienceFormValues,
  experienceDefaultValues,
  experienceSchema,
} from '@/schemas/experience'
import { getExperienceMediaFolder } from '@/utils/experience-media'
import { TemplateHeader } from '@/components/admin/shared/TemplateHeader'

interface ExperienceFormProps {
  mode?: 'create' | 'edit'
  experienceId?: string
  initialValues?: ExperienceFormValues
  initialPublished?: boolean
}

// Labels will be handled inside the component to use translations

const MAX_GALLERY_IMAGES = 4

export function CreateExperienceForm({
  mode: formMode = 'create',
  experienceId,
  initialValues,
  initialPublished = false,
}: ExperienceFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, startTransition] = useTransition()
  const [isCreatingDraft, startDraftTransition] = useTransition()
  const [hasStartedCreation, setHasStartedCreation] = useState(false)
  const [pendingAction, setPendingAction] = useState<'draft' | 'publish' | 'publish_view'>(
    initialPublished ? 'publish' : 'draft',
  )
  const t = useTranslations('templates.experiences')
  const baseT = useTranslations('templates.form')
  const {
    loading: isS3Loading,
    isConfigured: isS3Configured,
    error: s3Error,
    refresh: refreshS3,
  } = useS3Config()
  const [pickerIndex, setPickerIndex] = useState<number | null>(null)

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialValues ?? experienceDefaultValues,
    mode: 'onChange',
  })
  const [experienceTitle, experienceSlug] = form.watch(['title', 'slug'])
  const galleryFolder = useMemo(
    () =>
      getExperienceMediaFolder({
        slug: experienceSlug,
        fallbackTitle: experienceTitle,
        subfolder: 'gallery',
      }),
    [experienceSlug, experienceTitle],
  )

  const DURATION_LABELS: Record<(typeof DURATION_TYPES)[number], string> = {
    flexible: t('duration.flexible'),
    'single-day': t('duration.singleDay'),
    'multi-day': t('duration.multiDay'),
    hourly: t('duration.hourly'),
  }

  const DAY_LABELS: Record<(typeof DAY_OPTIONS)[number], string> = {
    monday: t('days.monday'),
    tuesday: t('days.tuesday'),
    wednesday: t('days.wednesday'),
    thursday: t('days.thursday'),
    friday: t('days.friday'),
    saturday: t('days.saturday'),
    sunday: t('days.sunday'),
  }

  const setGallerySlot = (index: number, url: string) => {
    const sanitized = url.trim()
    if (!sanitized) return
    const galleryValues = form.getValues('gallery')
    const current = Array.isArray(galleryValues) ? [...galleryValues] : []
    if (index < current.length) {
      current[index] = sanitized
    } else if (current.length < MAX_GALLERY_IMAGES) {
      current.push(sanitized)
    } else {
      current[MAX_GALLERY_IMAGES - 1] = sanitized
    }
    const next = current.filter((item) => typeof item === 'string' && item.trim().length > 0)
    form.setValue('gallery', next.slice(0, MAX_GALLERY_IMAGES), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onSubmit = (values: ExperienceFormValues) => {
    const actionMode = pendingAction
    startTransition(async () => {
      try {
        const result =
          formMode === 'edit' && experienceId
            ? await updateExperienceAction(experienceId, values, { mode: actionMode })
            : await createExperienceAction(values, { mode: actionMode })

        if (!result.success) {
          throw new Error(result.error || 'Failed to save experience')
        }

        const successTitle =
          actionMode === 'publish' || actionMode === 'publish_view'
            ? baseT('success.published')
            : baseT('success.draftSaved')
        const successDescription =
          actionMode === 'publish' || actionMode === 'publish_view'
            ? baseT('success.publishedDesc')
            : baseT('success.draftSavedDesc')

        toast({
          title: successTitle,
          description: successDescription,
        })

        setPendingAction(
          actionMode === 'publish' || actionMode === 'publish_view' ? 'publish' : 'draft',
        )

        if (actionMode === 'publish_view' && result.publicPath) {
          router.push(result.publicPath)
          return
        }

        if (result.redirectPath) {
          if (typeof window !== 'undefined' && result.redirectPath === window.location.pathname) {
            router.refresh()
          } else {
            router.push(result.redirectPath)
          }
          return
        }

        if (formMode === 'edit') {
          router.refresh()
        } else {
          router.push('/admin/dashboard/templates/experiences')
        }
      } catch (error) {
        console.error(error)
        toast({
          title: baseT('error.saveFailed'),
          description: baseT('error.saveFailedDesc'),
          variant: 'destructive',
        })
      }
    })
  }

  const handleBack = () => {
    router.push('/admin/dashboard/templates/experiences')
  }

  const { isDirty } = form.formState

  // Auto-create draft when title is typed
  useEffect(() => {
    if (formMode === 'create' && isDirty && !isCreatingDraft && !hasStartedCreation && experienceTitle.length > 5) {
      setHasStartedCreation(true)
      startDraftTransition(async () => {
        try {
          const values = form.getValues()
          const result = await createExperienceAction(values, { mode: 'draft' })

          if (result.success && result.experienceId) {
            toast({
              title: baseT('success.draftSaved'),
              description: baseT('success.draftSavedDesc'),
            })
            router.push(`/admin/dashboard/templates/experiences/edit/${result.experienceId}`)
          } else {
            console.error('Auto-draft failed:', result.error)
            setHasStartedCreation(false)
            toast({
              variant: 'destructive',
              title: baseT('error.saveFailed'),
              description: result.error || baseT('error.saveFailedDesc'),
            })
          }
        } catch (error) {
          console.error('Auto-draft failed', error)
          setHasStartedCreation(false)
        }
      })
    }
  }, [formMode, isDirty, isCreatingDraft, hasStartedCreation, experienceTitle, form, router, toast, baseT])

  if (isCreatingDraft || hasStartedCreation) {
    return (
      <PremiumLoading
        title={t('edit.createTitle')}
        subtitle={t('edit.headerDesc')}
      />
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <FormProvider {...form}>
        <Form {...form}>
          <MediaPicker
            isOpen={pickerIndex !== null}
            onClose={() => setPickerIndex(null)}
            onSelect={(item) => {
              if (pickerIndex === null) return
              setGallerySlot(pickerIndex, item.url)
              setPickerIndex(null)
            }}
            folder={galleryFolder}
          />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6 pb-12">
            <TemplateHeader
              title={formMode === 'create' ? t('edit.createTitle') : t('edit.editTitle')}
              subtitle={t('edit.headerDesc')}
              backHref="/admin/dashboard/templates/experiences"
              onBack={handleBack}
              onSave={form.handleSubmit(onSubmit)}
              isSaving={isSaving}
              saveLabel={baseT('publish')}
              savingLabel={baseT('publishing')}
              canSave={form.formState.isValid}
              rightActions={
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => setPendingAction('draft')}
                  className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-2xl h-11 px-6 font-medium"
                >
                  {baseT('saveDraft')}
                </Button>
              }
              onView={formMode === 'edit' ? () => {
                setPendingAction('publish_view');
                form.handleSubmit(onSubmit)();
              } : undefined}
              viewLabel={baseT('view')}
            />

            <main className="max-w-6xl mx-auto space-y-8">
              {/* Basics Section */}
              <section className="bg-white rounded-3xl border border-zinc-200/50 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-900">{t('edit.basics.title')}</h2>
                  <p className="text-sm text-zinc-500 font-medium">
                    {t('edit.basics.desc')}
                  </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.basics.fields.title')} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.basics.fields.titlePlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.basics.fields.slug')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.basics.fields.slugPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-400">
                          {t('edit.basics.fields.slugDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.basics.fields.location')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.basics.fields.locationPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hostName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.basics.fields.hostName')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.basics.fields.hostNamePlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="hostBio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.basics.hostBio')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t('edit.basics.fields.hostBioPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Image Gallery */}
              <section className="bg-white rounded-3xl border border-zinc-200/50 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-900">{t('edit.gallery.title')}</h2>
                  <p className="text-sm text-zinc-500 font-medium">
                    {t('edit.gallery.desc')}
                  </p>
                </div>

                {isS3Loading ? (
                  <p className="text-sm text-zinc-500 mb-4">{t('edit.gallery.checking')}</p>
                ) : s3Error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                    <p className="font-medium">{t('edit.gallery.s3ErrorTitle')}</p>
                    <p>{s3Error}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={refreshS3}
                    >
                      {t('edit.gallery.s3ErrorRetry')}
                    </Button>
                  </div>
                ) : !isS3Configured ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 mb-4">
                    {t('edit.gallery.s3NotConfigured')}
                  </div>
                ) : null}

                <FormField
                  control={form.control}
                  name="gallery"
                  render={({ field }) => {
                    const value = Array.isArray(field.value)
                      ? field.value.filter(
                        (item) => typeof item === 'string' && item.trim().length > 0,
                      )
                      : []

                    const handleRemove = (index: number) => {
                      if (index >= value.length) return
                      const next = value.filter((_, idx) => idx !== index)
                      field.onChange(next)
                    }

                    const handleManualChange = (index: number, raw: string) => {
                      const sanitized = raw.trim()
                      if (!sanitized) {
                        handleRemove(index)
                        return
                      }
                      const next = [...value]
                      if (index < next.length) {
                        next[index] = sanitized
                      } else if (next.length < MAX_GALLERY_IMAGES) {
                        next.push(sanitized)
                      }
                      field.onChange(next.slice(0, MAX_GALLERY_IMAGES))
                    }

                    const slots = Array.from({ length: MAX_GALLERY_IMAGES })

                    return (
                      <FormItem>
                        <FormControl>
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {slots.map((_, index) => {
                              const current = value[index] ?? ''
                              const slotKey = current ? `${index}-${current}` : `slot-${index}`

                              return (
                                <div key={slotKey} className="space-y-3">
                                  <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors">
                                    {current ? (
                                      <Image
                                        src={current}
                                        alt={`Gallery image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        unoptimized
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                                        {t('edit.gallery.emptySlot')}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-xs h-8"
                                        onClick={() => setPickerIndex(index)}
                                        disabled={isS3Loading || !isS3Configured}
                                      >
                                        {t('edit.gallery.select')}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRemove(index)}
                                        disabled={!current}
                                      >
                                        {t('edit.gallery.remove')}
                                      </Button>
                                    </div>
                                    <Input
                                      value={current}
                                      onChange={(e) => handleManualChange(index, e.target.value)}
                                      placeholder="https://..."
                                      className="h-8 text-xs bg-white"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </section>

              {/* Storytelling */}
              <section className="bg-white rounded-3xl border border-zinc-200/50 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-900">{t('edit.storytelling.title')}</h2>
                  <p className="text-sm text-zinc-500 font-medium">
                    {t('edit.storytelling.desc')}
                  </p>
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.storytelling.fields.summary')} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder={t('edit.storytelling.fields.summaryPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="narrative"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.storytelling.fields.narrative')} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            placeholder={t('edit.storytelling.fields.narrativePlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="activities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.storytelling.fields.activities')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t('edit.storytelling.fields.activitiesPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Logistics */}
              <section className="bg-white rounded-3xl border border-zinc-200/50 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-900">{t('edit.logistics.title')}</h2>
                  <p className="text-sm text-zinc-500 font-medium">
                    {t('edit.logistics.desc')}
                  </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="durationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.durationType')} <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-50 border-zinc-200 focus:ring-zinc-900 shadow-sm transition-all hover:bg-zinc-100">
                              <SelectValue placeholder={t('edit.logistics.fields.durationPlaceholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DURATION_TYPES.map((duration) => (
                              <SelectItem key={duration} value={duration}>
                                {DURATION_LABELS[duration]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.durationDetails')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.logistics.fields.durationDetailsPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="scheduleDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.availableDays')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mt-2">
                          {DAY_OPTIONS.map((day) => {
                            const selected = field.value?.includes(day)
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => {
                                  const current = new Set(field.value ?? [])
                                  if (current.has(day)) {
                                    current.delete(day)
                                  } else {
                                    current.add(day)
                                  }
                                  field.onChange(Array.from(current))
                                }}
                                className={`rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${selected
                                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                  }`}
                              >
                                {DAY_LABELS[day]}
                              </button>
                            )
                          })}
                        </div>
                        <FormDescription className="mt-2 text-zinc-400">
                          {t('edit.logistics.fields.availableDaysDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2 mt-6">
                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.timeWindowFrequency')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.logistics.fields.timeWindowFrequencyPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scheduleNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.scheduleNote')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder={t('edit.logistics.fields.scheduleNotePlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2 mt-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.referencePrice')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('edit.logistics.fields.referencePricePlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.currency')} <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-50 border-zinc-200 focus:ring-zinc-900 shadow-sm transition-all hover:bg-zinc-100">
                              <SelectValue placeholder={t('edit.logistics.fields.currencyPlaceholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="COP">COP</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2 mt-6">
                  <FormField
                    control={form.control}
                    name="inclusions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.inclusions')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t('edit.logistics.fields.inclusionsPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exclusions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 font-medium">
                          {t('edit.logistics.fields.exclusions')}{' '}
                          <span className="text-zinc-400 font-normal">{t('edit.basics.fields.optional')}</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t('edit.logistics.fields.exclusionsPlaceholder')}
                            {...field}
                            className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </main>
          </form>
        </Form>
      </FormProvider>
    </div>
  )
}
