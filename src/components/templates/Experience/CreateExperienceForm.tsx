'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
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
      <div className="min-h-screen bg-zinc-50/50">
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
              {/* Header */}
              <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="text-zinc-500 hover:text-zinc-900 -ml-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="hidden sm:block h-6 w-px bg-zinc-200" />
                    <div>
                      <h1 className="text-xl font-bold text-zinc-900">
                        {formMode === 'create' ? 'Create Experience' : 'Edit Experience'}
                      </h1>
                      <p className="text-sm text-zinc-500">
                        Capture the story, activities, and logistics.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSaving}
                      onClick={() => setPendingAction('draft')}
                      className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving || !form.formState.isValid}
                      onClick={() => setPendingAction('publish')}
                      className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
                    >
                      {isSaving && pendingAction === 'publish' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isSaving && pendingAction === 'publish' ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>
                </div>
              </header>

              <main className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
                {/* Basics Section */}
                <section className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-zinc-900">Basics</h2>
                    <p className="text-sm text-zinc-500">
                      Define the core details that identify this experience.
                    </p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-900 font-medium">
                            Experience Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Barranquilla, land of Shakira"
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
                            Slug <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="auto-generated if empty"
                              {...field}
                              className="bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-400">
                            Used for public URLs.
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
                            Location / Region{' '}
                            <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City or region"
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
                            Host Name <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Optional guide or storyteller"
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
                            Host Story <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Share the background of the host"
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
                <section className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-zinc-900">Image Gallery</h2>
                    <p className="text-sm text-zinc-500">
                      Store up to four images. They appear in a 2 × 2 grid on the public page.
                    </p>
                  </div>

                  {isS3Loading ? (
                    <p className="text-sm text-zinc-500 mb-4">Checking media storage...</p>
                  ) : s3Error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                      <p className="font-medium">S3 configuration error</p>
                      <p>{s3Error}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={refreshS3}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : !isS3Configured ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 mb-4">
                      Configure S3 in the plugins area to upload images directly.
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
                                          Empty Slot
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
                                          Select
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                          onClick={() => handleRemove(index)}
                                          disabled={!current}
                                        >
                                          Remove
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
                <section className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-zinc-900">Storytelling</h2>
                    <p className="text-sm text-zinc-500">
                      Describe the experience to inspire travelers.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-900 font-medium">
                            Summary <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="One to two sentence overview"
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
                            Full Narrative <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={8}
                              placeholder="Tell the full story of the experience"
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
                            Activities <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="List activities, one per line"
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
                <section className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-zinc-900">Logistics</h2>
                    <p className="text-sm text-zinc-500">
                      Capture practical information for planners and guests.
                    </p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="durationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-900 font-medium">
                            Duration Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-50 border-zinc-200 focus:ring-zinc-900">
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
                            Duration Details{' '}
                            <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 6 hours or 2 days / 1 night"
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
                            Available Days{' '}
                            <span className="text-zinc-400 font-normal">(optional)</span>
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
                                  className={`rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                                    selected
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
                            Select the recurring days the tour runs.
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
                            Time Window / Frequency{' '}
                            <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Departures at 9am and 2pm"
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
                            Schedule Notes{' '}
                            <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Blackout dates, holiday exceptions, etc."
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
                            Reference Price{' '}
                            <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 1.500.000"
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
                            Currency <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-50 border-zinc-200 focus:ring-zinc-900">
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

                  <div className="grid gap-8 md:grid-cols-2 mt-6">
                    <FormField
                      control={form.control}
                      name="inclusions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-900 font-medium">
                            Inclusions <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="What is included"
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
                            Exclusions <span className="text-zinc-400 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="What is not included"
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
    </AdminLayout>
  )
}
