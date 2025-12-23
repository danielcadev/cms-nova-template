/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { X } from 'lucide-react'
import type React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PlanFormValues } from '@/schemas/plan'

interface PriceOptionCardProps {
  index: number
  onRemove: () => void
  canRemove: boolean
  hasOtherGeneralPrice?: boolean
  fieldName?: 'priceOptions'
}

export function PriceOptionCard({
  index,
  onRemove,
  canRemove,
  hasOtherGeneralPrice = false,
  fieldName = 'priceOptions',
}: PriceOptionCardProps) {
  const t = useTranslations('templates.tourism.edit.sections.pricing.fields')
  const { control, setValue, watch, trigger } = useFormContext<PlanFormValues>()
  // Use watch with array to get stable references and reduce re-renders
  const [mode, label, seasonTitle, seasonAccommodations] = watch([
    `${fieldName}.${index}.mode` as any,
    `${fieldName}.${index}.label` as any,
    `${fieldName}.${index}.seasonTitle` as any,
    `${fieldName}.${index}.seasonAccommodations` as any,
  ])

  const currentMode: 'simple' | 'advanced' | 'seasonal' = mode || 'simple'

  const handleModeChange = (newMode: 'simple' | 'advanced' | 'seasonal') => {
    if (newMode === currentMode) return

    // Set mode first without triggering full validation
    setValue(`${fieldName}.${index}.mode` as any, newMode, {
      shouldDirty: true,
      shouldValidate: false,
    })

    // Normalize fields to avoid stale state when switching modes
    if (newMode === 'simple') {
      setValue(`${fieldName}.${index}.label` as any, '', {
        shouldDirty: true,
        shouldValidate: false,
      })
      setValue(`${fieldName}.${index}.seasonTitle` as any, '', {
        shouldDirty: true,
        shouldValidate: false,
      })
      setValue(`${fieldName}.${index}.seasonAccommodations` as any, [], {
        shouldDirty: true,
        shouldValidate: false,
      })
      // Keep price & currency; simple uses them
    } else if (newMode === 'advanced') {
      // Ensure label exists and clear seasonal data
      const currentLabel = label || ''
      setValue(`${fieldName}.${index}.label` as any, currentLabel, {
        shouldDirty: true,
        shouldValidate: false,
      })
      setValue(`${fieldName}.${index}.seasonTitle` as any, '', {
        shouldDirty: true,
        shouldValidate: false,
      })
      setValue(`${fieldName}.${index}.seasonAccommodations` as any, [], {
        shouldDirty: true,
        shouldValidate: false,
      })
      // Keep price & currency; advanced uses them
    } else if (newMode === 'seasonal') {
      // Clear simple/advanced price & label and ensure seasonal structure exists
      setValue(`${fieldName}.${index}.label` as any, '', {
        shouldDirty: true,
        shouldValidate: false,
      })
      setValue(`${fieldName}.${index}.price` as any, '', {
        shouldDirty: true,
        shouldValidate: false,
      })
      const hasArray = Array.isArray(seasonAccommodations)
      if (!hasArray) {
        setValue(`${fieldName}.${index}.seasonAccommodations` as any, [], {
          shouldDirty: true,
          shouldValidate: false,
        })
      }
      const currentTitle = seasonTitle || ''
      setValue(`${fieldName}.${index}.seasonTitle` as any, currentTitle, {
        shouldDirty: true,
        shouldValidate: false,
      })
    }
  }

  const formatExistingValue = (value: string | number | null | undefined) => {
    if (value === undefined || value === null || value === '') return ''
    const strValue = String(value)
    if (strValue.includes('.')) return strValue
    if (/^\d+$/.test(strValue)) return Number(strValue).toLocaleString('es-CO')
    return strValue
  }

  const handlePriceChange = (path: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numbersOnly = value.replace(/[^0-9]/g, '')
    if (numbersOnly === '') {
      setValue(path as any, '', { shouldDirty: true, shouldValidate: true })
      trigger(path as any)
      return
    }
    const formatted = Number(numbersOnly).toLocaleString('es-CO')
    setValue(path as any, formatted, { shouldDirty: true, shouldValidate: true })
    trigger(path as any)
  }

  // Seasonal accommodations array
  const {
    fields: accommodationFields,
    append: appendAccommodation,
    remove: removeAccommodation,
  } = useFieldArray({ control, name: `${fieldName}.${index}.seasonAccommodations` as any })

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Row: Mode selector + Remove */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="inline-flex rounded-lg border border-zinc-200 p-1 bg-zinc-50 w-full sm:w-auto">
          <button
            type="button"
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentMode === 'simple'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
              } ${hasOtherGeneralPrice && currentMode !== 'simple' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !hasOtherGeneralPrice && handleModeChange('simple')}
          >
            {t('modes.simple')}
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentMode === 'advanced'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
            onClick={() => handleModeChange('advanced')}
          >
            {t('modes.advanced')}
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentMode === 'seasonal'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
            onClick={() => handleModeChange('seasonal')}
          >
            {t('modes.seasonal')}
          </button>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-zinc-400 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="mt-6 space-y-4">
        {currentMode !== 'seasonal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMode === 'advanced' && (
              <FormField
                control={control}
                name={`${fieldName}.${index}.label` as any}
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-1">
                    <FormLabel className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">
                      {t('description')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('descriptionPlaceholder')} className="text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name={`${fieldName}.${index}.currency` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">
                    {t('currency')}
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={t('currency')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COP">COP</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${fieldName}.${index}.price` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">
                    {t('price')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm select-none">
                        $
                      </span>
                      <Input
                        {...field}
                        value={formatExistingValue(field.value)}
                        type="text"
                        placeholder="1.500.000"
                        onChange={handlePriceChange(`${fieldName}.${index}.price`)}
                        className="pl-7 text-sm font-medium"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {currentMode === 'seasonal' && (
          <div className="space-y-6">
            <FormField
              control={control}
              name={`${fieldName}.${index}.seasonTitle` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">
                    {t('seasonTitle')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('seasonTitlePlaceholder')}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                <FormLabel className="text-sm font-semibold text-zinc-900">
                  {t('accommodationsTitle')}
                </FormLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendAccommodation({
                      id: Math.random().toString(36).substring(2, 9),
                      accommodation: '',
                      price: '',
                      currency: 'COP',
                    })
                  }
                  className="w-full sm:w-auto text-xs h-8 rounded-2xl"
                >
                  {t('addAccommodation')}
                </Button>
              </div>

              {accommodationFields.length === 0 && (
                <div className="text-sm text-zinc-500 text-center py-4 bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
                  {t('noAccommodations')}
                </div>
              )}

              <div className="space-y-3">
                {accommodationFields.map((f, accIndex) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-end bg-zinc-50/50 p-3 rounded-lg border border-zinc-100"
                  >
                    <div className="sm:col-span-3">
                      <FormField
                        control={control}
                        name={
                          `${fieldName}.${index}.seasonAccommodations.${accIndex}.accommodation` as any
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-zinc-500">{t('accommodation')}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t('accommodationPlaceholder')}
                                className="text-sm bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        control={control}
                        name={`${fieldName}.${index}.seasonAccommodations.${accIndex}.price` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-zinc-500">{t('price')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">
                                  $
                                </span>
                                <Input
                                  {...field}
                                  value={formatExistingValue(field.value)}
                                  type="text"
                                  placeholder="1.500.000"
                                  onChange={handlePriceChange(
                                    `${fieldName}.${index}.seasonAccommodations.${accIndex}.price`,
                                  )}
                                  className="pl-6 text-sm bg-white"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-zinc-400 hover:text-red-600 hover:bg-red-50 w-full h-10 rounded-lg"
                        onClick={() => removeAccommodation(accIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
