'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { publishPlanAction, updatePlanDataAction } from '@/app/actions/plan-actions'
import { ContentHeader } from '@/components/admin/shared/ContentHeader'
import { ImageUploadProvider, useImageUpload } from '@/contexts/ImageUploadContext'
import { useToast } from '@/hooks/use-toast'
import { type PlanFormValues, planSchema } from '@/schemas/plan'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { IncludesSection } from './sections/IncludesSection'
import { ItinerarySection } from './sections/ItinerarySection'
import { PricingSection } from './sections/PricingSection'
import { VideoSection } from './sections/VideoSection'

interface EditPlanFormProps {
  planId: string
  initialData: PlanFormValues
}

// Internal component that uses the context
function EditPlanFormInner({ planId, initialData }: EditPlanFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isUploading: isAnyImageUploading } = useImageUpload()
  const [isSubmitting, startTransition] = useTransition()

  // Header states
  const [status, setStatus] = useState(initialData.published ? 'published' : 'draft')

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: initialData,
  })

  const {
    formState: { isDirty },
    reset,
  } = form

  // Reset form when initialData changes
  useEffect(() => {
    reset(initialData)
    setLastSavedValues(JSON.stringify(initialData))
  }, [initialData, reset])

  // Auto-save functionality
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSavedValues, setLastSavedValues] = useState<string>('')
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const saveForm = useCallback(
    async (data: PlanFormValues) => {
      try {
        setIsAutoSaving(true)
        const result = await updatePlanDataAction(planId, data)
        if (!result.success) {
          throw new Error(result.error || 'Failed to save')
        }
        setLastSavedValues(JSON.stringify(data))
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsAutoSaving(false)
      }
    },
    [planId],
  )

  // Watch values for auto-save
  const watchedValues = form.watch()

  useEffect(() => {
    if (!isDirty || isAutoSaving || isSubmitting || isAnyImageUploading) return

    const currentValues = JSON.stringify(watchedValues)
    if (currentValues === lastSavedValues) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const data = form.getValues()
      saveForm(data)
    }, 5000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [
    watchedValues,
    isDirty,
    isAutoSaving,
    isSubmitting,
    isAnyImageUploading,
    saveForm,
    form,
    lastSavedValues,
  ])

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  const handleSave = async (saveStatus: string = status) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    startTransition(async () => {
      try {
        const formData = form.getValues()
        const dataToSave = {
          ...formData,
          published: saveStatus === 'published',
        }

        const result = await updatePlanDataAction(planId, dataToSave)
        if (result.success) {
          setLastSavedValues(JSON.stringify(dataToSave))

          if (saveStatus === 'published') {
            const publishResult = await publishPlanAction(planId, {
              articleAlias: formData.articleAlias,
              categoryAlias: formData.categoryAlias,
              section: formData.section,
            })
            if (!publishResult.success) {
              throw new Error(publishResult.error || 'Failed to publish plan')
            }
          }
          setStatus(saveStatus)
          toast({
            title: 'Changes saved',
            description:
              saveStatus === 'published'
                ? 'Plan published successfully.'
                : 'Draft saved successfully.',
          })
        } else {
          throw new Error(result.error || 'Failed to save plan')
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error saving plan',
          description: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    })
  }

  const handleFinalSubmit = async (_data: PlanFormValues) => {
    await handleSave(status)
  }

  const handlePublishAndView = async () => {
    startTransition(async () => {
      try {
        const formData = form.getValues()
        const dataToSave = {
          ...formData,
          published: true,
        }

        const result = await updatePlanDataAction(planId, dataToSave)
        if (!result.success) {
          throw new Error(result.error || 'Failed to save plan before publishing')
        }

        const publishResult = await publishPlanAction(planId, {
          articleAlias: formData.articleAlias,
          categoryAlias: formData.categoryAlias,
          section: formData.section,
        })

        if (publishResult.success && publishResult.publicPath) {
          router.push(publishResult.publicPath)
        } else {
          throw new Error(publishResult.error || 'Failed to publish plan')
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error publishing plan',
          description: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    })
  }

  const validateForm = () => {
    const formData = form.getValues()
    return !!(formData.mainTitle && formData.articleAlias)
  }

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Title, destination, and main details',
      component: <BasicInfoSection />,
    },
    {
      id: 'includes',
      title: "What's Included",
      description: "What's included and excluded in the plan",
      component: <IncludesSection />,
    },
    {
      id: 'itinerary',
      title: 'Itinerary',
      description: 'Day by day activities and schedule',
      component: <ItinerarySection />,
    },
    {
      id: 'pricing',
      title: 'Pricing',
      description: 'Price options for different group sizes',
      component: <PricingSection />,
    },
    {
      id: 'video',
      title: 'Video',
      description: 'Promotional video content',
      component: <VideoSection />,
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFinalSubmit)}>
          <div className="max-w-5xl mx-auto px-6 py-4 pb-24">
            <ContentHeader
              backUrl="/admin/dashboard/templates/tourism"
              backLabel="Back"
              title={`Edit ${initialData.mainTitle || 'Tourism Plan'}`}
              description={
                isAutoSaving
                  ? 'Auto-saving changes...'
                  : 'Fill in the fields to edit this tourism plan.'
              }
              status={status}
              onStatusChange={setStatus}
              onSave={handleSave}
              onPublishAndView={handlePublishAndView}
              isSaving={isSubmitting || isAutoSaving}
              isFormValid={validateForm()}
              showPublishAndView={true}
              showUrlPreview={false}
            />

            {/* Auto-save indicator */}
            {isAutoSaving && (
              <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Auto-saving...
              </div>
            )}

            {/* Main content */}
            <div className="space-y-8 mt-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h2 className="text-lg font-semibold text-zinc-900">{section.title}</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">{section.description}</p>
                  </div>
                  <div className="p-6">{section.component}</div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

// Main component with provider
export function EditPlanForm(props: EditPlanFormProps) {
  return (
    <ImageUploadProvider>
      <EditPlanFormInner {...props} />
    </ImageUploadProvider>
  )
}
