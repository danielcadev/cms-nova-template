'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, LayoutTemplate } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
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

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      mainTitle: '',
      promotionalText: '',
      includes: [],
      itinerary: [],
      priceOptions: [],
    },
  })

  const {
    formState: { isDirty },
  } = form

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates/tourism')
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
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Creating your plan...</h3>
            <p className="text-sm text-zinc-500">
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
    <AdminLayout>
      <div className="min-h-screen bg-zinc-50/50">
        <FormProvider {...form}>
          <form>
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
              <div className="max-w-5xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleGoBack}
                      className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 -ml-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="h-6 w-px bg-zinc-200"></div>
                    <div>
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mb-0.5">
                        <LayoutTemplate className="w-3 h-3" />
                        <span>Templates / Tourism</span>
                      </div>
                      <h1 className="text-lg font-bold text-zinc-900">Create New Plan</h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                    Ready to create
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
              <div className="space-y-8">
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
    </AdminLayout>
  )
}
