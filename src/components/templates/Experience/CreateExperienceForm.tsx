'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { createExperienceAction, updateExperienceAction } from '@/app/actions/experience-actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
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

interface ExperienceFormProps {
  mode?: 'create' | 'edit'
  experienceId?: string
  initialValues?: ExperienceFormValues
  initialPublished?: boolean
}

const DURATION_LABELS: Record<(typeof DURATION_TYPES)[number], string> = {
  flexible: 'Flexible / custom duration',
  'single-day': 'Single day experience',
  'multi-day': 'Multi-day experience',
  hourly: 'Hourly experience',
}

const DAY_LABELS: Record<(typeof DAY_OPTIONS)[number], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

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
  const [pendingAction, setPendingAction] = useState<'draft' | 'publish' | 'publish_view'>(
    initialPublished ? 'publish' : 'draft',
  )
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

  const setGallerySlot = (index: number, url: string) => {
    const sanitized = url.trim()
    if (!sanitized) return
    const current = Array.isArray(form.getValues('gallery')) ? [...form.getValues('gallery')] : []
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
            ? 'Experience published'
            : 'Draft saved'
        const successDescription =
          actionMode === 'publish' || actionMode === 'publish_view'
            ? 'Your experience is now available with the latest details.'
            : 'Draft saved successfully. You can continue editing later.'

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
          title: 'Save failed',
          description: 'Please try again once the API is connected.',
          variant: 'destructive',
        })
      }
    })
  }

  const handleBack = () => {
    router.push('/admin/dashboard/templates/experiences')
  }

  return (
    <AdminLayout>
      <div className="min-h-screen theme-bg">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <header className="theme-card theme-border-b sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to experiences
                    </Button>
                    <div className="hidden sm:block h-6 w-px theme-border" />
                    <div>
                      <h1 className="text-xl sm:text-2xl font-semibold theme-text">
                        Create new experience
                      </h1>
                      <p className="text-sm theme-text-secondary">
                        Capture the story, activities, and logistics for your experience.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="submit"
                      variant="outline"
                      className="gap-2"
                      disabled={isSaving}
                      onClick={() => setPendingAction('draft')}
                    >
                      Save as draft
                    </Button>
                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={isSaving || !form.formState.isValid}
                      onClick={() => setPendingAction('publish')}
                    >
                      {isSaving && pendingAction === 'publish' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving && pendingAction === 'publish' ? 'Publishing…' : 'Publish'}
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      className="gap-2"
                      disabled={isSaving || !form.formState.isValid}
                      onClick={() => setPendingAction('publish_view')}
                    >
                      {isSaving && pendingAction === 'publish_view' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {isSaving && pendingAction === 'publish_view'
                        ? 'Publishing…'
                        : 'Publish & view'}
                    </Button>
                  </div>
                </div>
              </header>

              <main className="max-w-6xl mx-auto px-6 pb-12 space-y-10">
                <p className="text-xs text-right theme-text-secondary">
                  Fields marked with <span className="text-red-500 dark:text-red-400">*</span> are
                  required. Everything else is optional.
                </p>
                <section className="theme-card theme-border rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold theme-text">Basics</h2>
                    <p className="text-sm theme-text-secondary">
                      Define the core details that identify this experience.
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Experience title
                            <span className="text-red-500 dark:text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Barranquilla, land of Shakira" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            Slug
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="auto-generated if empty" {...field} />
                          </FormControl>
                          <FormDescription>Used for public URLs when available.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Location / region
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="City or region" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            Host name
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Optional guide or storyteller" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="hostBio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Host story
                          <span className="text-xs font-normal theme-text-secondary">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Share the background of the host"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section className="theme-card theme-border rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold theme-text">Image gallery</h2>
                    <p className="text-sm theme-text-secondary">
                      Store up to four images for this experience. They appear in a 2 × 2 grid on
                      the public page.
                    </p>
                  </div>
                  {isS3Loading ? (
                    <p className="text-sm theme-text-secondary">Checking media storage…</p>
                  ) : s3Error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      <p className="font-medium text-red-800">S3 configuration error</p>
                      <p className="mt-1">{s3Error}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={refreshS3}
                      >
                        Retry configuration
                      </Button>
                    </div>
                  ) : !isS3Configured ? (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                      Configure S3 in the plugins area to upload images directly. You can still
                      paste external URLs below.
                    </p>
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
                        <FormItem className="space-y-3">
                          <FormControl>
                            <div className="grid gap-6 sm:grid-cols-2">
                              {slots.map((_, index) => {
                                const current = value[index] ?? ''
                                const slotKey = current ? `${index}-${current}` : `slot-${index}`

                                return (
                                  <div key={slotKey} className="space-y-3">
                                    <div className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-100/60 dark:border-slate-700 dark:bg-slate-900/40">
                                      {current ? (
                                        <Image
                                          src={current}
                                          alt={`Gallery image ${index + 1}`}
                                          fill
                                          className="object-cover"
                                          sizes="(max-width: 768px) 100vw, 50vw"
                                          unoptimized
                                        />
                                      ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                                          No image selected
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        type="button"
                                        onClick={() => setPickerIndex(index)}
                                        disabled={isS3Loading || !isS3Configured}
                                      >
                                        Open media library
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleRemove(index)}
                                        disabled={!current}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <Input
                                      value={current}
                                      onChange={(event) => {
                                        handleManualChange(index, event.target.value)
                                      }}
                                      placeholder="https://..."
                                    />
                                    <FormDescription>Square images work best.</FormDescription>
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

                <section className="theme-card theme-border rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold theme-text">Storytelling</h2>
                    <p className="text-sm theme-text-secondary">
                      Describe the experience to inspire travelers.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Summary
                          <span className="text-red-500 dark:text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="One to two sentence overview"
                            {...field}
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
                        <FormLabel className="flex items-center gap-1">
                          Full narrative
                          <span className="text-red-500 dark:text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            placeholder="Tell the full story of the experience"
                            {...field}
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
                        <FormLabel className="flex items-center gap-2">
                          Activities
                          <span className="text-xs font-normal theme-text-secondary">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="List activities, one per line"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section className="theme-card theme-border rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold theme-text">Logistics</h2>
                    <p className="text-sm theme-text-secondary">
                      Capture practical information for planners and guests.
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="durationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Duration type
                            <span className="text-red-500 dark:text-red-400">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
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
                          <FormDescription>
                            Decide if this experience is hourly, single or multi-day.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Duration details
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 6 hours or 2 days / 1 night" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="scheduleDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Available days
                          <span className="text-xs font-normal theme-text-secondary">
                            (optional)
                          </span>
                        </FormLabel>
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
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
                                aria-pressed={selected}
                                className={`rounded-lg border px-3 py-2 text-sm transition ${
                                  selected
                                    ? 'border-primary/60 bg-primary/10 text-primary'
                                    : 'theme-border theme-card theme-text-secondary hover:theme-card-hover'
                                }`}
                              >
                                {DAY_LABELS[day]}
                              </button>
                            )
                          })}
                        </div>
                        <FormDescription>
                          Select the recurring days the tour runs (leave empty for flexible dates).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="schedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Time window / frequency
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Departures at 9am and 2pm" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            Schedule notes
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Blackout dates, holiday exceptions, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Reference price
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1.500.000" {...field} />
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
                          <FormLabel className="flex items-center gap-1">
                            Currency
                            <span className="text-red-500 dark:text-red-400">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
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
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="inclusions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Inclusions
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="What is included" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            Exclusions
                            <span className="text-xs font-normal theme-text-secondary">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="What is not included" {...field} />
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
    </AdminLayout>
  )
}
