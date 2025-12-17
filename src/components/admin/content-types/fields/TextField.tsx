'use client'

import { Hash, Type } from 'lucide-react'
import { useState } from 'react'

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
  const [isFocused, setIsFocused] = useState(false)
  const length = (value || '').length
  const maxLength = isSlug ? 100 : 200
  const isNearLimit = length > maxLength * 0.8

  return (
    <div className="space-y-2">
      <div
        className={`relative transition-all duration-200 border rounded-xl overflow-hidden ${
          isFocused ? 'ring-2 border-[var(--theme-accent)]' : 'border-[var(--theme-border)]'
        }`}
        style={{
          backgroundColor: 'var(--theme-card)',
          '--tw-ring-color': 'var(--theme-accent-light)',
        }}
      >
        {/* Input Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isSlug ? (
            <Hash className="h-4 w-4" style={{ color: 'var(--theme-text-muted)' }} />
          ) : (
            <Type className="h-4 w-4" style={{ color: 'var(--theme-text-muted)' }} />
          )}
        </div>

        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-base ${
            isSlug ? 'font-mono tracking-tight text-sm' : 'font-medium'
          }`}
          style={{
            color: 'var(--theme-text-primary)',
            '::placeholder': { color: 'var(--theme-text-muted)' },
          }}
          placeholder={placeholder || (isSlug ? 'my-awesome-slug' : 'Enter text...')}
          maxLength={maxLength}
        />

        {/* Character Counter Badge */}
        {showCounter && length > 0 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}
              style={{
                backgroundColor: isNearLimit
                  ? 'var(--theme-accent-light)'
                  : 'var(--theme-bg-secondary)',
                color: isNearLimit ? 'var(--theme-accent)' : 'var(--theme-text-secondary)',
              }}
            >
              {length}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {showCounter && (
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1" style={{ color: 'var(--theme-text-muted)' }}>
            {isSlug ? (
              <>
                <Hash className="h-3 w-3" />
                URL-friendly format (lowercase, dashes only)
              </>
            ) : (
              <>
                <Type className="h-3 w-3" />
                Plain text content
              </>
            )}
          </span>

          {length > 0 && (
            <span
              className="font-medium"
              style={{
                color: isNearLimit ? 'var(--theme-accent)' : 'var(--theme-text-secondary)',
              }}
            >
              {length} characters
            </span>
          )}
        </div>
      )}
    </div>
  )
}
