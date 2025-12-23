'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, LayoutTemplate } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { createDraftPlanAction } from '@/app/actions/plan-actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TemplateHeader } from '@/components/admin/dashboard/TemplatesPage/TemplateHeader'
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
  const t = useTranslations('templates.tourism.create')
  const editT = useTranslations('templates.tourism.edit')
  const formT = useTranslations('templates.form')
  const [isCreatingDraft, startTransition] = useTransition()

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      mainTitle: '',
      promotionalText: '',
      includes: [],
      itinerary: [],
      priceOptions: [],
      allowGroundTransport: false,
      published: false,
      generalPolicies: '',
      transportOptions: [],
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
        try {
          toast({
            title: t('creating'),
            description: t('creatingDesc'),
          })

          const formData = form.getValues()
          const result = await createDraftPlanAction(formData)

          if (result.success && result.planId) {
            toast({
              title: t('success'),
              description: t('successDesc'),
            })
            // Redirect to the new draft edit page
            router.push(`/admin/dashboard/templates/tourism/edit/${result.planId}`)
          } else {
            throw new Error(result.error || formT('error.saveFailed'))
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: formT('error.saveFailed'),
            description: error instanceof Error ? error.message : formT('error.saveFailedDesc'),
          })
        }
      })
    }
  }, [isDirty, isCreatingDraft, router, toast, form, t, formT])

  // While creating the draft, we show a loading state to avoid interaction.
  if (isCreatingDraft) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">{t('creating')}</h3>
          <p className="text-sm text-zinc-500">{t('creatingDesc')}</p>
        </div>
      </div>
    )
  }

  const sections = [
    {
      id: 'basic',
      component: <BasicInfoSection />,
    },
    {
      id: 'includes',
      component: <IncludesSection />,
    },
    {
      id: 'itinerary',
      component: <ItinerarySection />,
    },
    {
      id: 'pricing',
      component: <PricingSection />,
    },
    {
      id: 'video',
      component: <VideoSection />,
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <FormProvider {...form}>
        <form>
          <TemplateHeader
            title={t('title')}
            subtitle={t('creatingDesc')}
            backHref="/admin/dashboard/templates/tourism"
            onBack={handleGoBack}
            rightActions={
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-2xl text-xs font-bold border border-blue-100 dark:border-blue-900/30">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse"></div>
                {formT('saving')}
              </div>
            }
          />

          {/* Main content */}
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="space-y-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-3xl border border-zinc-200/50 shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h2 className="text-lg font-semibold text-zinc-900">
                      {editT(`sections.${section.id}.title`)}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {editT(`sections.${section.id}.description`)}
                    </p>
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
