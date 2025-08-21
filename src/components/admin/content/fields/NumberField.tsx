'use client'

import { ThemedButton } from '@/components/ui/ThemedButton'

interface NumberFieldProps {
  value: number | null | undefined
  onChange: (value: number | null) => void
  placeholder?: string
  id?: string
}

export function NumberField({ value, onChange, placeholder, id }: NumberFieldProps) {
  const current = typeof value === 'number' ? value : value ? Number(value) : 0
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        step="any"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full pr-20 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent"
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-2 flex items-center gap-1">
        <ThemedButton
          type="button"
          variantTone="outline"
          size="sm"
          onClick={() => onChange(current - 1)}
        >
          −
        </ThemedButton>
        <ThemedButton
          type="button"
          variantTone="outline"
          size="sm"
          onClick={() => onChange(current + 1)}
        >
          +
        </ThemedButton>
      </div>
    </div>
  )
}
