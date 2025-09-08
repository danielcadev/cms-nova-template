/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { X } from 'lucide-react'
import type React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
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
  const { control, setValue, watch, trigger } = useFormContext<PlanFormValues>()
  const mode: 'simple' | 'advanced' | 'seasonal' =
    (watch(`${fieldName}.${index}.mode` as any) as any) || 'simple'

  const handleModeChange = (newMode: 'simple' | 'advanced' | 'seasonal') => {
    if (newMode === mode) return

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
      const currentLabel = watch(`${fieldName}.${index}.label` as any) || ''
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
      const hasArray = Array.isArray(watch(`${fieldName}.${index}.seasonAccommodations` as any))
      if (!hasArray) {
        setValue(`${fieldName}.${index}.seasonAccommodations` as any, [], {
          shouldDirty: true,
          shouldValidate: false,
        })
      }
      const currentTitle = watch(`${fieldName}.${index}.seasonTitle` as any) || ''
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
    <div className="rounded-xl border theme-border p-4 sm:p-5 theme-card">
      {/* Row: Mode selector + Remove */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border theme-border overflow-hidden">
          <button
            type="button"
            className={`px-3 py-1.5 text-sm ${
              mode === 'simple' ? 'theme-bg-secondary font-semibold' : 'theme-card'
            } ${hasOtherGeneralPrice && mode !== 'simple' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !hasOtherGeneralPrice && handleModeChange('simple')}
          >
            General
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm ${mode === 'advanced' ? 'theme-bg-secondary font-semibold' : 'theme-card'}`}
            onClick={() => handleModeChange('advanced')}
          >
            Specific
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm ${mode === 'seasonal' ? 'theme-bg-secondary font-semibold' : 'theme-card'}`}
            onClick={() => handleModeChange('seasonal')}
          >
            Seasonal
          </button>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="mt-4 space-y-4">
        {mode !== 'seasonal' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mode === 'advanced' && (
              <FormField
                control={control}
                name={`${fieldName}.${index}.label` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-600">Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 2 passengers" />
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
                  <FormLabel className="text-xs text-gray-600">Currency</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
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
                  <FormLabel className="text-xs text-gray-600">Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs select-none">
                        $
                      </span>
                      <Input
                        {...field}
                        value={formatExistingValue(field.value)}
                        type="text"
                        placeholder="1.500.000"
                        onChange={handlePriceChange(`${fieldName}.${index}.price`)}
                        className="pl-6"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {mode === 'seasonal' && (
          <div className="space-y-3">
            <FormField
              control={control}
              name={`${fieldName}.${index}.seasonTitle` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-600">Season title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., LOW SEASON - Wednesday to Sunday" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs text-gray-600">Accommodations & prices</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendAccommodation({
                      id: Math.random().toString(36).substring(2, 9),
                      accommodation: '',
                      price: '',
                      currency: 'COP',
                    })
                  }
                >
                  Add
                </Button>
              </div>

              {accommodationFields.length === 0 && (
                <div className="text-xs text-gray-500">
                  No accommodations yet. Click "Add" to create one.
                </div>
              )}

              <div className="space-y-2">
                {accommodationFields.map((f, accIndex) => (
                  <div key={f.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end">
                    <div className="sm:col-span-3">
                      <FormField
                        control={control}
                        name={
                          `${fieldName}.${index}.seasonAccommodations.${accIndex}.accommodation` as any
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-gray-600">Accommodation</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Double, Triple" />
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
                            <FormLabel className="text-xs text-gray-600">Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs select-none">
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
                                  className="pl-6"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-1 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => removeAccommodation(accIndex)}
                      >
                        Remove
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
