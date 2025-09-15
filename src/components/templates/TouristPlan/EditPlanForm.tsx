'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { publishPlanAction, updatePlanDataAction } from '@/app/actions/plan-actions'
import { ContentHeader } from '@/components/admin/shared/ContentHeader'
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

const _AutosaveStatus = ({ isDirty, isSaving }: { isDirty: boolean; isSaving: boolean }) => {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 theme-accent rounded-full animate-pulse"></div>
        <span className="text-sm theme-text-secondary">Saving...</span>
      </div>
    )
  }
  if (isDirty) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        <span className="text-sm theme-text-secondary">Unsaved changes</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm theme-text-secondary">All changes saved</span>
    </div>
  )
}

const _FORM_STORAGE_KEY_PREFIX = 'planForm-edit-'

export function EditPlanForm({ planId, initialData }: EditPlanFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, startTransition] = useTransition()
  const [_isPublishing, _startPublishTransition] = useTransition()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))

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

  // Resetear el formulario cuando cambien los initialData
  useEffect(() => {
    reset(initialData)
    // Initialize saved values to prevent unnecessary auto-saves on load
    setLastSavedValues(JSON.stringify(initialData))
  }, [initialData, reset])

  // Auto-save functionality with proper debouncing
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
        // Update the saved values to prevent unnecessary saves
        setLastSavedValues(JSON.stringify(data))
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsAutoSaving(false)
      }
    },
    [planId],
  )

  // Watch all form values for auto-save with smart debouncing
  const watchedValues = form.watch()

  useEffect(() => {
    if (!isDirty || isAutoSaving || isSubmitting) return

    const currentValues = JSON.stringify(watchedValues)

    // Don't save if values haven't actually changed
    if (currentValues === lastSavedValues) return

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      const data = form.getValues()
      saveForm(data)
    }, 3000) // Increased delay to 3 seconds for better UX

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [watchedValues, isDirty, isAutoSaving, isSubmitting, saveForm, form, lastSavedValues])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  const handleSave = async (saveStatus: string = status) => {
    // Cancel any pending auto-save before manual save
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
          // Update saved values to prevent auto-save conflicts
          setLastSavedValues(JSON.stringify(dataToSave))

          if (saveStatus === 'published') {
            // Also publish the plan
            const publishResult = await publishPlanAction(planId, {
              articleAlias: formData.articleAlias,
              categoryAlias: formData.categoryAlias,
              section: formData.section,
            })
            if (publishResult.success) {
              toast({
                title: 'Plan published successfully!',
                description: publishResult.publicPath
                  ? `Available at: ${publishResult.publicPath}`
                  : undefined,
              })
            }
          } else {
            toast({
              title: 'Plan saved successfully!',
              description: `Article alias: ${formData.articleAlias || 'Not set'}`,
            })
          }
          setStatus(saveStatus)
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
    // Basic validation - you can expand this
    return !!(formData.mainTitle && formData.articleAlias)
  }

  const _handleGoBack = () => {
    router.push('/admin/dashboard/templates/tourism')
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      component: <BasicInfoSection />,
    },
    {
      id: 'includes',
      title: "What's Included",
      component: <IncludesSection />,
    },
    {
      id: 'itinerary',
      title: 'Itinerary',
      component: <ItinerarySection />,
    },
    {
      id: 'pricing',
      title: 'Pricing',
      component: <PricingSection />,
    },
    {
      id: 'video',
      title: 'Video',
      component: <VideoSection />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFinalSubmit)}>
          <div className="max-w-6xl mx-auto px-8 py-8">
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
              <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Auto-saving...
              </div>
            )}

            {/* Main content */}
            <div className="space-y-6">
              {sections.map((section) => {
                const isExpanded = expandedSections.has(section.id)
                return (
                  <div
                    key={section.id}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            isExpanded
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                            {section.title}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {section.id === 'basic' && 'Title, destination, and main details'}
                            {section.id === 'includes' &&
                              "What's included and excluded in the plan"}
                            {section.id === 'itinerary' && 'Day by day activities and schedule'}
                            {section.id === 'pricing' && 'Price options for different group sizes'}
                            {section.id === 'video' && 'Promotional video content'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isExpanded
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                          )}
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-0">
                        <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-100 dark:border-gray-800">
                          {section.component}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
