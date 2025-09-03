'use client'

import { memo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import type { PlanFormValues } from '@/schemas/plan'
import { PricingSection as RootPricingSection } from '../../../../../PricingSection'

// Wrapper que reutiliza la sección de precios de la carpeta raíz y migra datos legacy
export const PricingSection = memo(function PricingSection() {
  const form = useFormContext<PlanFormValues>()

  useEffect(() => {
    const current = (form.getValues('priceOptions') as any[]) || []
    if (!Array.isArray(current) || current.length === 0) return

    // Detectar formato legacy: tiene numPersons y/o perPersonPrice numérico
    const hasLegacy = current.some(
      (it) => it && (typeof it.numPersons === 'number' || typeof it.perPersonPrice === 'number'),
    )
    if (!hasLegacy) return

    const toStr = (n: number | null | undefined) => {
      if (n === null || n === undefined) return ''
      try {
        return Number(n).toLocaleString('es-CO')
      } catch {
        return String(n)
      }
    }

    const migrated = current.map((it) => {
      if (it && (typeof it.numPersons === 'number' || typeof it.perPersonPrice === 'number')) {
        return {
          id: it.id || Math.random().toString(36).slice(2, 9),
          mode: 'advanced' as const,
          label: `${it.numPersons ?? ''} personas`.trim(),
          price: toStr(it.perPersonPrice ?? 0),
          currency: it.currency ?? 'COP',
        }
      }
      return it
    })

    form.setValue('priceOptions', migrated as any, { shouldDirty: false, shouldValidate: true })
  }, [form])

  return <RootPricingSection form={form} />
})
