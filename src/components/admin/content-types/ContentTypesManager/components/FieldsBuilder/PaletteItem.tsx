'use client'

import { useDraggable } from '@dnd-kit/core'

interface FieldType {
  type: string
  label: string
  icon: JSX.Element
  description: string
  color: string
}

interface PaletteItemProps {
  fieldType: FieldType
}

export function PaletteItem({ fieldType }: PaletteItemProps) {
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
          {fieldType.label}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {fieldType.description}
        </p>
      </div>
    </button>
  )
}
