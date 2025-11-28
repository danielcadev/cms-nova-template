'use client'

import { useFormContext } from 'react-hook-form'
import type { PlanFormValues } from '@/schemas/plan'
import { MainImage } from '../../components/MainImage'

export function CoverImageConfig() {
  const form = useFormContext<PlanFormValues>()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Cover Image</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">
          This will be the first impression of your plan. Choose a high-quality horizontal image.
        </p>
      </div>
      <div className="lg:col-span-2">
        <MainImage form={form} />
      </div>
    </div>
  )
}
