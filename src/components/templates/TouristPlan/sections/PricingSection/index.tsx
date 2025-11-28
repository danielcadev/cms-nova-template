'use client'

import { Plus } from 'lucide-react'
import { memo, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { PlanFormValues } from '@/schemas/plan'
import { AutoFillSeasonalPricesButton } from './AutoFillSeasonalPricesButton'
import { PriceOptionCard } from './PriceOptionCard'

export const PricingSection = memo(function PricingSection() {
  const form = useFormContext<PlanFormValues>()
  const { control, watch } = form

  const { fields, append, remove } = useFieldArray({ control, name: 'priceOptions' })

  const items = useMemo(
    () =>
      fields.map((f, index) => ({
        id: f.id,
        index,
        mode:
          (watch(`priceOptions.${index}.mode`) as 'simple' | 'advanced' | 'seasonal') || 'simple',
      })),
    [fields, watch],
  )

  const generalItems = items.filter((it) => it.mode === 'simple')
  const specificItems = items.filter((it) => it.mode === 'advanced')
  const seasonalItems = items.filter((it) => it.mode === 'seasonal')

  const hasGeneral = generalItems.length > 0

  const addGeneral = () => {
    if (hasGeneral) return
    append({
      id: Math.random().toString(36).slice(2, 9),
      mode: 'simple',
      label: '',
      price: '',
      currency: 'COP',
    } as any)
  }

  const addSpecific = () => {
    append({
      id: Math.random().toString(36).slice(2, 9),
      mode: 'advanced',
      label: '',
      price: '',
      currency: 'COP',
    } as any)
  }

  const addSeasonal = () => {
    append({
      id: Math.random().toString(36).slice(2, 9),
      mode: 'seasonal',
      label: '',
      price: '',
      seasonTitle: '',
      seasonAccommodations: [],
      currency: 'COP',
    } as any)
  }

  const removeAt = (index: number) => remove(index)

  return (
    <div className="space-y-10">
      {/* General */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">General Price</h3>
            <p className="text-sm text-zinc-500">One price for the whole plan.</p>
          </div>
          {!hasGeneral && (
            <Button type="button" onClick={addGeneral} variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Add General Price
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {generalItems.length === 0 ? (
            <div className="bg-zinc-50 rounded-xl p-6 border border-dashed border-zinc-200 text-center">
              <p className="text-sm text-zinc-500">No general price configured.</p>
            </div>
          ) : (
            generalItems.map(({ id, index }) => (
              <PriceOptionCard
                key={id}
                index={index}
                onRemove={() => removeAt(index)}
                canRemove={true}
                hasOtherGeneralPrice={true}
              />
            ))
          )}
        </div>
      </section>

      <div className="h-px bg-zinc-100" />

      {/* Specific */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Specific Prices</h3>
            <p className="text-sm text-zinc-500">
              Prices with a custom description (e.g., per person, couple).
            </p>
          </div>
          <Button type="button" onClick={addSpecific} variant="outline" size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Specific Price
          </Button>
        </div>
        <div className="space-y-4">
          {specificItems.length === 0 ? (
            <div className="bg-zinc-50 rounded-xl p-6 border border-dashed border-zinc-200 text-center">
              <p className="text-sm text-zinc-500">No specific prices configured.</p>
            </div>
          ) : (
            specificItems.map(({ id, index }) => (
              <PriceOptionCard
                key={id}
                index={index}
                onRemove={() => removeAt(index)}
                canRemove={true}
                hasOtherGeneralPrice={hasGeneral}
              />
            ))
          )}
        </div>
      </section>

      <div className="h-px bg-zinc-100" />

      {/* Seasonal */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Seasonal Prices</h3>
            <p className="text-sm text-zinc-500">Different prices per season and accommodation.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button type="button" onClick={addSeasonal} variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Add Seasonal Price
            </Button>
            <AutoFillSeasonalPricesButton />
          </div>
        </div>
        <div className="space-y-4">
          {seasonalItems.length === 0 ? (
            <div className="bg-zinc-50 rounded-xl p-6 border border-dashed border-zinc-200 text-center">
              <p className="text-sm text-zinc-500">No seasonal prices configured.</p>
            </div>
          ) : (
            seasonalItems.map(({ id, index }) => (
              <PriceOptionCard
                key={id}
                index={index}
                onRemove={() => removeAt(index)}
                canRemove={true}
                hasOtherGeneralPrice={hasGeneral}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
})
