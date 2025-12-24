import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CustomRichEditor from './CustomRichEditor'

interface RichTextFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onAutoGenerate?: () => void
}

export default function RichTextField({
  value,
  onChange,
  placeholder,
  className,
  onAutoGenerate,
}: RichTextFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <CustomRichEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
          />
        </div>
        {onAutoGenerate && (
          <Button
            type="button"
            variant="outline"
            onClick={onAutoGenerate}
            className="shrink-0 rounded-xl px-4 border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-all shadow-sm mt-[1px]"
            title="AI Assistant"
          >
            <Sparkles className="h-4 w-4 mr-2 text-zinc-400" />
            AI
          </Button>
        )}
      </div>
    </div>
  )
}
