'use client'

import { Wand2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { PlanFormValues } from '@/schemas/plan'

export function AutoFillSeasonalPricesButton() {
  const { setValue, getValues } = useFormContext<PlanFormValues>()

  const handleAutoFill = () => {
    // Check if 3 seasons already exist
    const currentOptions = getValues('priceOptions') || []
    const existingSeasons = currentOptions.filter(
      (option) =>
        option && typeof option === 'object' && 'mode' in option && option.mode === 'seasonal',
    )

    if (existingSeasons.length >= 3) {
      // Already present; do nothing
      return
    }

    // Clear all existing options
    setValue('priceOptions', [], { shouldDirty: true, shouldValidate: true })

    // Default accommodations
    const accommodations = [
      'SINGLE',
      'DOUBLE',
      'TRIPLE',
      'QUADRUPLE',
      'QUINTUPLE',
      'CHILD 3 TO 10 YEARS',
      'INFANT 0 TO 2 YEARS',
    ]

    // Create 3 seasons
    const seasons = ['LOW SEASON', 'MID SEASON', 'HIGH SEASON']

    const newSeasons = seasons.map((seasonTitle) => {
      const seasonAccommodations = accommodations.map((accommodation) => ({
        id: Math.random().toString(36).substring(2, 9),
        accommodation,
        price: '1.000.000', // Default price with dot thousand separators
        currency: 'COP',
      }))

      return {
        id: Math.random().toString(36).substring(2, 9),
        mode: 'seasonal' as const,
        label: seasonTitle,
        price: '',
        seasonTitle,
        seasonAccommodations,
        currency: 'COP',
      }
    })

    // Set new seasons
    setValue('priceOptions', newSeasons, { shouldDirty: true, shouldValidate: true })
  }

  // Check if 3 seasons already exist for the label
  const currentOptions = getValues('priceOptions') || []
  const existingSeasons = currentOptions.filter(
    (option) =>
      option && typeof option === 'object' && 'mode' in option && option.mode === 'seasonal',
  )
  const hasAllSeasons = existingSeasons.length >= 3

  return (
    <Button
      type="button"
      onClick={handleAutoFill}
      variant="outline"
      size="sm"
      className="h-9 bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
    >
      <Wand2 className="h-4 w-4 mr-2 text-purple-500" />
      <span className="hidden sm:inline">
        {hasAllSeasons ? 'Recreate seasons' : 'Auto-fill Seasons'}
      </span>
      <span className="sm:hidden">Auto-fill</span>
    </Button>
  )
}
