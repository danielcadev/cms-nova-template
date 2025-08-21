'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toCamelCase } from '@/utils/formatters'
import type { ContentTypeFormValues } from '../ContentTypesManager/ContentTypeForm'
import { fieldTypes } from './constants'

interface SortableFieldRowProps {
  field: any
  index: number
  remove: (index: number) => void
}

export function SortableFieldRow({ field, index, remove }: SortableFieldRowProps) {
  const { control, setValue } = useFormContext<ContentTypeFormValues>()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
  }
  const labelValue = useWatch({ control, name: `fields.${index}.label` })

  useEffect(() => {
    if (labelValue) setValue(`fields.${index}.apiIdentifier`, toCamelCase(labelValue))
  }, [labelValue, index, setValue])

  const fieldTypeInfo = fieldTypes.find((ft) => ft.type === field.type)

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
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {fieldTypeInfo?.label || field.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {field.apiIdentifier}
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
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            switchField.value
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
          </div>
        </div>
      </div>
    </div>
  )
}
