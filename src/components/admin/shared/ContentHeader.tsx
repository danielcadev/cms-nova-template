'use client'

import { ArrowLeft, Copy, Eye, Save } from 'lucide-react'
import Link from 'next/link'
import { useId } from 'react'
import { Button } from '@/components/ui/button'

interface ContentHeaderProps {
  // Navigation
  backUrl: string
  backLabel: string

  // Content info
  title: string
  description: string

  // Status management
  status: string
  onStatusChange: (status: string) => void
  statusLabel?: string
  statusOptions?: {
    draft: string
    published: string
    archived?: string
  }

  // Optional URL preview (read-only)
  currentUrl?: string

  // Actions
  onSave: (status?: string) => void
  onPublishAndView?: () => void
  isSaving: boolean
  isFormValid: boolean

  // Localization labels
  saveDraftLabel?: string
  publishLabel?: string
  savingLabel?: string
  viewLabel?: string

  // Optional customization
  showPublishAndView?: boolean
  showUrlPreview?: boolean
}

export function ContentHeader({
  backUrl,
  backLabel,
  title,
  description,
  status,
  onStatusChange,
  statusLabel = 'Status:',
  statusOptions,
  currentUrl,
  onSave,
  onPublishAndView,
  isSaving,
  isFormValid,
  saveDraftLabel = 'Save Draft',
  publishLabel = 'Publish',
  savingLabel = 'Saving...',
  viewLabel = 'View',
  showPublishAndView = true,
  showUrlPreview = false,
}: ContentHeaderProps) {
  const statusId = useId()

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="rounded-2xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10 w-10 p-0 shadow-sm transition-all"
              title={backLabel}
            >
              <Link href={backUrl}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{title}</h1>
          </div>
          <p className="text-zinc-500 text-lg max-w-3xl ml-13 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:pt-2">
          {/* Status Selector */}
          <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-2xl px-4 py-2 shadow-sm transition-all hover:border-zinc-300">
            <label htmlFor={statusId} className="text-sm font-medium text-zinc-500 whitespace-nowrap">
              {statusLabel}
            </label>
            <select
              id={statusId}
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-zinc-900 focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
            >
              <option value="draft">{statusOptions?.draft || 'Draft'}</option>
              <option value="published">{statusOptions?.published || 'Published'}</option>
              {statusOptions?.archived && <option value="archived">{statusOptions.archived}</option>}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onSave('draft')}
              disabled={isSaving}
              className="rounded-2xl bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 h-11 px-6 font-medium transition-all shadow-sm"
            >
              {isSaving ? savingLabel : saveDraftLabel}
            </Button>

            <Button
              onClick={() => onSave('published')}
              disabled={isSaving || !isFormValid}
              className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 h-11 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? savingLabel : publishLabel}
            </Button>

            {showPublishAndView && onPublishAndView && (
              <Button
                variant="outline"
                onClick={onPublishAndView}
                disabled={isSaving || !isFormValid}
                className="rounded-2xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-11 px-5 font-medium transition-all shadow-sm"
              >
                <Eye className="h-5 w-5 mr-2" />
                {viewLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Optional URL Preview */}
      {showUrlPreview && currentUrl && (
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
              Public URL
            </div>
            <div className="font-mono text-sm text-zinc-900 truncate">{currentUrl}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(currentUrl)}
            className="text-zinc-500 hover:text-zinc-900"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      )}
    </div>
  )
}
