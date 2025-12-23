'use client'

import { Wand2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { PlanFormValues } from '@/schemas/plan'

export function AutoFillSeasonalPricesButton() {
  const t = useTranslations('templates.tourism.edit.sections.pricing')
  const { setValue, getValues } = useFormContext<PlanFormValues>()

  const handleAutoFill = () => {
    // Check if 3 seasons already exist
    const currentOptions = getValues('priceOptions') || []
    const existingSeasons = currentOptions.filter(
      (option: any) =>
        option && typeof option === 'object' && 'mode' in option && option.mode === 'seasonal',
    )

    if (existingSeasons.length >= 3) {
      // Already present; do nothing
      return
    }

    // Clear all existing options
    setValue('priceOptions', [], { shouldDirty: true, shouldValidate: true })

    // Default accommodations from translations
    const seasons = [t('seasons.low'), t('seasons.mid'), t('seasons.high')]

    const newSeasons = seasons.map((seasonTitle) => {
      const seasonAccommodations = [
        { id: '1', accommodation: t('seasons.single'), price: '', currency: 'COP' as const },
        { id: '2', accommodation: t('seasons.double'), price: '', currency: 'COP' as const },
        { id: '3', accommodation: t('seasons.triple'), price: '', currency: 'COP' as const },
      ]

      return {
        id: Math.random().toString(36).substring(2, 9),
        mode: 'seasonal' as const,
        label: seasonTitle,
        price: '',
        seasonTitle,
        seasonAccommodations,
        currency: 'COP' as const,
      }
    })

    // Set new seasons
    setValue('priceOptions', newSeasons as any, { shouldDirty: true, shouldValidate: true })
  }

  // Check if 3 seasons already exist
  const currentOptions = getValues('priceOptions') || []
  const existingSeasons = currentOptions.filter(
    (option: any) =>
      option && typeof option === 'object' && 'mode' in option && option.mode === 'seasonal',
  )
  const hasAllSeasons = existingSeasons.length >= 3

  return (
    <Button
      type="button"
      onClick={handleAutoFill}
      variant="outline"
      size="sm"
      className="h-9 bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-2xl"
    >
      <Wand2 className="h-4 w-4 mr-2 text-purple-500" />
      <span className="hidden sm:inline">
        {hasAllSeasons ? t('autoFill.recreate') : t('autoFill.autoFill')}
      </span>
      <span className="sm:hidden">{t('autoFill.mini')}</span>
    </Button>
  )
}
