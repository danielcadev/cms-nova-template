import { Button } from '@/components/ui/button'
import { Hash, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface SlugFieldProps {
    value: string | undefined
    onChange: (value: string) => void
    onAutoGenerate?: () => void
    placeholder?: string
    id?: string
    isRequired?: boolean
}

export function SlugField({
    value,
    onChange,
    onAutoGenerate,
    placeholder,
    id,
    isRequired = false,
}: SlugFieldProps) {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div
                    className={`relative flex-1 transition-all duration-200 border rounded-xl overflow-hidden ${isFocused ? 'ring-2 border-zinc-900 ring-zinc-900/5' : 'border-zinc-200'
                        }`}
                >
                    {/* Input Icon */}
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Hash className="h-4 w-4 text-zinc-400" />
                    </div>

                    <input
                        id={id}
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white text-sm font-mono tracking-tight focus:outline-none text-zinc-900"
                        placeholder={placeholder || 'url-slug'}
                        required={isRequired}
                    />
                </div>

                {onAutoGenerate && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onAutoGenerate}
                        className="shrink-0 rounded-xl"
                        title="Generate from title"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Auto
                    </Button>
                )}
            </div>

            <p className="text-xs text-zinc-500">
                URL-friendly (lowercase, numbers, dashes)
            </p>
        </div>
    )
}
