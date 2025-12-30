'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, LayoutTemplate } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { createDraftPlanAction } from '@/app/actions/plan-actions'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TemplateHeader } from '@/components/admin/shared/TemplateHeader'
import { PremiumLoading } from '@/components/admin/dashboard/PremiumLoading'
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
  const [hasStartedCreation, setHasStartedCreation] = useState(false)

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
    watch,
  } = form

  const mainTitle = watch('mainTitle')

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates/tourism')
  }

  useEffect(() => {
    // Auto-create draft when the user starts typing the title
    if (isDirty && !isCreatingDraft && !hasStartedCreation && mainTitle.length > 5) {
      setHasStartedCreation(true)
      startTransition(async () => {
        try {
          const formData = form.getValues()
          const result = await createDraftPlanAction(formData)

          if (result.success && result.planId) {
            toast({
              title: t('success'),
              description: t('successDesc'),
            })
            router.push(`/admin/dashboard/templates/tourism/edit/${result.planId}`)
          } else {
            console.error('Auto-draft failed:', result.error)
            setHasStartedCreation(false)
            toast({
              variant: 'destructive',
              title: formT('error.saveFailed'),
              description: result.error || formT('error.saveFailedDesc'),
            })
          }
        } catch (error) {
          console.error('Auto-draft failed', error)
          setHasStartedCreation(false)
          toast({
            variant: 'destructive',
            title: formT('error.saveFailed'),
            description: error instanceof Error ? error.message : formT('error.saveFailedDesc'),
          })
        }
      })
    }
  }, [isDirty, isCreatingDraft, hasStartedCreation, mainTitle, router, toast, form, t, formT])

  if (isCreatingDraft || hasStartedCreation) {
    return (
      <PremiumLoading
        title={t('creating')}
        subtitle={t('creatingDesc')}
      />
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
    <div className="min-h-screen bg-zinc-50/30 pb-20">
      <FormProvider {...form}>
        <form>
          <TemplateHeader
            title={t('title')}
            subtitle={t('creatingDesc')}
            backHref="/admin/dashboard/templates/tourism"
            onBack={handleGoBack}
            rightActions={
              <div className="flex items-center gap-2 group px-4 py-2 bg-white/50 border border-zinc-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse group-hover:scale-110 transition-transform"></div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{formT('readyToCreate')}</span>
              </div>
            }
          />

          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Context Widget */}
            <div className="mb-12 p-8 bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-zinc-900/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-zinc-700/50"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {t('title')}
                  </h2>
                  <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                    Comienza definiendo el título de tu plan. Una vez que lo hagas, el sistema creará un borrador automático para habilitar el guardado permanente.
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-zinc-800/50 backdrop-blur-sm p-4 rounded-3xl border border-zinc-700/30">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Paso 1</span>
                    <span className="text-sm font-semibold text-zinc-100">Configuración Inicial</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-12">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="group relative transition-all duration-500"
                >
                  <div className="absolute -inset-4 bg-zinc-100/50 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative bg-white rounded-[2.5rem] border border-zinc-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5">
                    <div className="px-8 py-6 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                          {editT(`sections.${section.id}.title`)}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1 font-medium">
                          {editT(`sections.${section.id}.description`)}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-zinc-100/50 rounded-2xl flex items-center justify-center text-zinc-400 font-mono text-xs font-bold border border-zinc-200/30 group-hover:bg-white group-hover:text-zinc-900 transition-all">
                        #{sections.findIndex(s => s.id === section.id) + 1}
                      </div>
                    </div>
                    <div className="p-8 sm:p-10">{section.component}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
