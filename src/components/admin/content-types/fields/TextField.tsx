'use client'

import { Hash, Type, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TextFieldProps {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  isSlug?: boolean
  showCounter?: boolean
  id?: string
  isRequired?: boolean
  onAutoGenerate?: () => void
}

export function TextField({
  value,
  onChange,
  placeholder,
  isSlug = false,
  showCounter = true,
  id,
  isRequired = false,
  onAutoGenerate,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const length = (value || '').length
  const maxLength = isSlug ? 100 : 200
  const isNearLimit = length > maxLength * 0.8

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div
          className={`relative flex-1 transition-all duration-200 border rounded-xl overflow-hidden ${isFocused ? 'ring-2 border-[var(--theme-accent)]' : 'border-[var(--theme-border)]'
            }`}
          style={{
            backgroundColor: 'var(--theme-card)',
            borderColor: isFocused ? 'var(--theme-accent)' : 'var(--theme-border)',
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
            className={`w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-base ${isSlug ? 'font-mono tracking-tight text-sm' : 'font-medium'
              }`}
            style={{
              color: 'var(--theme-text-primary)',
            }}
            placeholder={placeholder || (isSlug ? 'my-awesome-slug' : 'Enter text...')}
            maxLength={maxLength}
            required={isRequired}
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

        {onAutoGenerate && (
          <Button
            type="button"
            variant="outline"
            onClick={onAutoGenerate}
            className="shrink-0 rounded-xl px-4 border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-all shadow-sm"
            title="AI Assistant"
          >
            <Sparkles className="h-4 w-4 mr-2 text-zinc-400 group-hover:text-zinc-900" />
            AI
          </Button>
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
            {isRequired && <span className="text-red-500 font-bold ml-1">*</span>}
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
