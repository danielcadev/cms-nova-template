'use client'

import { memo } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { PlanFormValues } from '@/schemas/plan'
import { AutoFillSeasonalPricesButton } from './AutoFillSeasonalPricesButton'
import { PriceOptionCard } from './PriceOptionCard'

// Full revamp: Three Notion-like blocks with independent add controls
export const PricingSection = memo(function PricingSection() {
  const form = useFormContext<PlanFormValues>()
  const { control, watch } = form

  const { fields, append, remove } = useFieldArray({ control, name: 'priceOptions' })

  const items = fields.map((f, index) => ({
    id: f.id,
    index,
    mode: (watch(`priceOptions.${index}.mode`) as 'simple' | 'advanced' | 'seasonal') || 'simple',
  }))

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
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold theme-text">General Price</h3>
            <p className="text-xs theme-text-secondary">One price for the whole plan.</p>
          </div>
          {!hasGeneral && (
            <Button type="button" onClick={addGeneral} className="text-sm">
              Add General Price
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {generalItems.length === 0 ? (
            <p className="text-sm text-gray-500">No general price.</p>
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

      {/* Specific */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold theme-text">Specific Prices</h3>
            <p className="text-xs theme-text-secondary">Prices with a custom description.</p>
          </div>
          <Button type="button" onClick={addSpecific} className="text-sm">
            Add Specific Price
          </Button>
        </div>
        <div className="space-y-3">
          {specificItems.length === 0 ? (
            <p className="text-sm text-gray-500">No specific prices.</p>
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

      {/* Seasonal */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold theme-text">Seasonal Prices</h3>
            <p className="text-xs theme-text-secondary">
              Different prices per season and accommodation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={addSeasonal} className="text-sm">
              Add Seasonal Price
            </Button>
            <AutoFillSeasonalPricesButton />
          </div>
        </div>
        <div className="space-y-3">
          {seasonalItems.length === 0 ? (
            <p className="text-sm text-gray-500">No seasonal prices.</p>
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
