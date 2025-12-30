'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Link2, RefreshCw, Trash2, List } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toCamelCase } from '@/utils/formatters'
import type { ContentTypeFormValues } from '../ContentTypeForm'
import { fieldTypes } from './constants'

interface SortableFieldRowProps {
  field: any
  index: number
  remove: (index: number) => void
}

export function SortableFieldRow({ field, index, remove }: SortableFieldRowProps) {
  const { control, setValue } = useFormContext<ContentTypeFormValues>()
  const t = useTranslations('contentTypes.form')
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
  }
  const labelValue = useWatch({ control, name: `fields.${index}.label` })
  const [routes, setRoutes] = useState<{ value: string; label: string }[]>([])
  const [loadingRoutes, setLoadingRoutes] = useState(false)

  const fetchRoutes = async (silent = false) => {
    if (!silent) setLoadingRoutes(true)
    try {
      const response = await fetch('/api/admin/system/routes')
      const data = await response.json()
      if (data.success && data.routes) {
        setRoutes(data.routes)
      }
    } catch (error) {
      console.error('Error fetching routes:', error)
    } finally {
      if (!silent) setLoadingRoutes(false)
    }
  }

  const fieldTypeInfo = fieldTypes.find((ft) => ft.type === field.type)
  const slugRouteValue = useWatch({ control, name: `fields.${index}.slugRoute` })

  useEffect(() => {
    // Auto-fetch routes if a value is already selected so the label appears correctly
    if (fieldTypeInfo?.type === 'SLUG' && slugRouteValue) {
      fetchRoutes(true)
    }
  }, [fieldTypeInfo?.type, slugRouteValue])

  useEffect(() => {
    if (labelValue) setValue(`fields.${index}.apiIdentifier`, toCamelCase(labelValue))
  }, [labelValue, index, setValue])

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-6">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="icon"
            {...attributes}
            {...listeners}
            className="cursor-grab hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mt-1"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </Button>

          {/* Field Type Icon */}
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-gray-600 dark:text-gray-400">{fieldTypeInfo?.icon}</span>
          </div>

          {/* Field Configuration */}
          <div className="flex-1 space-y-4">
            {/* Header with type and actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {labelValue || field.label || 'Untitled'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex items-center gap-2">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    {fieldTypeInfo ? t(fieldTypeInfo.labelKey) : field.type}
                  </span>
                  <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
                  <span>{field.apiIdentifier}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`fields.${index}.isRequired`}
                  render={({ field: switchField }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <button
                          type="button"
                          onClick={() => switchField.onChange(!switchField.value)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${switchField.value
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                          {switchField.value ? 'Required' : 'Optional'}
                        </button>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Label Input */}
            <FormField
              control={control}
              name={`fields.${index}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Field label"
                      {...field}
                      className="border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SLUG Route Discovery */}
            {fieldTypeInfo?.type === 'SLUG' && (
              <div className="space-y-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('slugRouteMapping')}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fetchRoutes()}
                    disabled={loadingRoutes}
                    className="h-8 px-3 text-xs font-medium"
                  >
                    {loadingRoutes ? (
                      <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3 mr-1.5" />
                    )}
                    Scan Routes
                  </Button>
                </div>
                <FormField
                  control={control}
                  name={`fields.${index}.slugRoute` as any}
                  render={({ field: slugField }) => (
                    <FormItem>
                      <Select onValueChange={slugField.onChange} value={slugField.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder={routes.length === 0 ? t('scanRoutesPlaceholder') : t('selectRoute')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {routes.length === 0 ? (
                            <SelectItem value="__placeholder__" disabled className="text-gray-500 italic">
                              {t('noRoutesFound')}
                            </SelectItem>
                          ) : (
                            routes.map((route) => (
                              <SelectItem key={route.value} value={route.value} className="font-mono text-sm">
                                {route.value}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        {t('routeMappingHelp')}
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
