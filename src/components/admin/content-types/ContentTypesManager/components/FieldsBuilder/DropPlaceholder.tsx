'use client'

import { useDroppable } from '@dnd-kit/core'
import { Sparkles } from 'lucide-react'

interface DropPlaceholderProps {
  id: string
}

export function DropPlaceholder({ id }: DropPlaceholderProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`my-2 rounded-xl border-2 border-dashed transition-all duration-200 ${
        isOver
          ? 'bg-white/70 dark:bg-gray-900/70 border-gray-300 dark:border-gray-700 shadow-sm'
          : 'bg-transparent border-gray-200 dark:border-gray-800'
      }`}
      style={{ minHeight: 44 }}
    >
      <div className="flex items-center justify-center px-3 py-2">
        <div
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${
            isOver
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium tracking-tight">Drop here to add field</span>
        </div>
      </div>
    </div>
  )
}
