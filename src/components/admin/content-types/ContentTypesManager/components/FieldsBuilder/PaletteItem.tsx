'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { useTranslations } from 'next-intl'

interface FieldType {
  type: string
  labelKey: string
  descKey: string
  icon: React.JSX.Element
}

interface PaletteItemProps {
  fieldType: FieldType
}

export function PaletteItem({ fieldType }: PaletteItemProps) {
  const t = useTranslations('contentTypes.form')
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${fieldType.type}`,
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-grab w-full group text-center"
    >
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
        <span className="text-gray-600 dark:text-gray-400">{fieldType.icon}</span>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
          {t(fieldType.labelKey)}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {t(fieldType.descKey)}
        </p>
      </div>
    </button>
  )
}
