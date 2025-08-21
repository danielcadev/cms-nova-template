'use client'

interface TextFieldProps {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  isSlug?: boolean
  showCounter?: boolean
  id?: string
}

export function TextField({
  value,
  onChange,
  placeholder,
  isSlug = false,
  showCounter = true,
  id,
}: TextFieldProps) {
  const length = (value || '').length

  return (
    <div className="space-y-1">
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent ${isSlug ? 'font-mono tracking-tight' : ''}`}
        placeholder={placeholder}
      />
      {showCounter && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{isSlug ? 'Lowercase, dashes, no spaces' : 'Text'}</span>
          <span>{length} characters</span>
        </div>
      )}
    </div>
  )
}
