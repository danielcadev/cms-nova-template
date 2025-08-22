'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createDraftPlanAction } from '@/app/actions/plan-actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { type PlanFormValues, planSchema } from '@/schemas/plan'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { IncludesSection } from './sections/IncludesSection'
import { ItinerarySection } from './sections/ItinerarySection'
import { PricingSection } from './sections/PricingSection'
import { VideoSection } from './sections/VideoSection'

export function CreatePlanForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreatingDraft, startTransition] = useTransition()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      mainTitle: '',
      promotionalText: '',
      itinerary: [],
      priceOptions: [],
    },
  })

  const { formState: { isDirty } } = form

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates/tourism')
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  useEffect(() => {
    // If the form has been modified and we're not already creating a draft...
    if (isDirty && !isCreatingDraft) {
      startTransition(async () => {
        let toastId: string | undefined
        try {
          toastId = toast({
            title: 'Creating draft...',
            description: 'Please wait, we are preparing everything for autosave.',
          }).id

          const formData = form.getValues()
          const result = await createDraftPlanAction(formData)

          if (result.success && result.planId) {
            toast({
              title: 'Draft created!',
              description: 'Now all your changes will be saved automatically.',
            })
            // Redirect to the new draft edit page
            router.push(`/admin/dashboard/templates/tourism/edit/${result.planId}`)
          } else {
            throw new Error(result.error || 'Could not initialize the plan.')
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error creating draft',
            description: error instanceof Error ? error.message : 'Unknown error',
          })
        } finally {
          if (toastId) {
            // Optional: close the "Creating..." toast if necessary
          }
        }
      })
    }
  }, [isDirty, isCreatingDraft, router, toast, form.getValues])

  // While creating the draft, we show a loading state to avoid interaction.
  if (isCreatingDraft) {
    return (
      <AdminLayout>
        <div className="min-h-screen theme-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-semibold theme-text mb-2">Creating your plan...</h3>
            <p className="text-sm theme-text-secondary">
              Setting up autosave and preparing your workspace
            </p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      component: <BasicInfoSection />
    },
    {
      id: 'includes',
      title: 'What\'s Included',
      component: <IncludesSection />
    },
    {
      id: 'itinerary',
      title: 'Itinerary',
      component: <ItinerarySection />
    },
    {
      id: 'pricing',
      title: 'Pricing',
      component: <PricingSection />
    },
    {
      id: 'video',
      title: 'Video',
      component: <VideoSection />
    }
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen theme-bg">
        <FormProvider {...form}>
          <form>
            {/* Header */}
            <div className="theme-card theme-border-b sticky top-0 z-10 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleGoBack}
                      className="flex items-center gap-3 theme-text-secondary hover:theme-text theme-hover px-4 py-2 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span className="font-medium">Back to Plans</span>
                    </Button>
                    <div className="w-px h-8 theme-border"></div>
                    <div>
                      <h1 className="text-2xl font-bold theme-text">
                        Create New Tourism Plan
                      </h1>
                      <p className="text-sm theme-text-secondary mt-1">
                        Start typing to activate autosave
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm theme-text-secondary">Ready to create</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto px-8 py-8">
              <div className="space-y-6">
                {sections.map((section) => {
                  const isExpanded = expandedSections.has(section.id)
                  return (
                    <div key={section.id} className="theme-card rounded-xl theme-border shadow-sm">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full p-6 text-left theme-hover rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            isExpanded 
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200' 
                              : 'theme-bg-secondary group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                          }`}>
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 theme-text-secondary" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold theme-text group-hover:theme-accent transition-colors">
                              {section.title}
                            </h2>
                            <p className="text-sm theme-text-secondary mt-1">
                              {section.id === 'basic' && 'Title, destination, and main details'}
                              {section.id === 'includes' && 'What\'s included and excluded in the plan'}
                              {section.id === 'itinerary' && 'Day by day activities and schedule'}
                              {section.id === 'pricing' && 'Price options for different group sizes'}
                              {section.id === 'video' && 'Promotional video content'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm theme-text-secondary group-hover:theme-text transition-colors">
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isExpanded 
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                          }`}>
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
    </AdminLayout>
  )
}