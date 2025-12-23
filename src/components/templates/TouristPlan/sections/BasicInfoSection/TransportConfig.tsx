'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import type { PlanFormValues } from '@/schemas/plan'

export function TransportConfig() {
  const t = useTranslations('templates.tourism.edit.sections.transport')
  const { control } = useFormContext<PlanFormValues>()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{t('title')}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{t('description')}</p>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl p-6 border border-zinc-200">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <FormLabel className="text-base font-medium text-zinc-900">
                {t('fields.groundTransport')}
              </FormLabel>
              <p className="text-sm text-zinc-500">{t('fields.groundTransportDesc')}</p>
            </div>
            <FormField
              control={control}
              name="allowGroundTransport"
              render={({ field }) => (
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
