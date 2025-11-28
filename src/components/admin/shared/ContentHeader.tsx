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

  // Optional URL preview (read-only)
  currentUrl?: string

  // Actions
  onSave: (status?: string) => void
  onPublishAndView?: () => void
  isSaving: boolean
  isFormValid: boolean

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
  currentUrl,
  onSave,
  onPublishAndView,
  isSaving,
  isFormValid,
  showPublishAndView = true,
  showUrlPreview = false,
}: ContentHeaderProps) {
  const statusId = useId()

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center gap-2">
            <Link href={backUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 -ml-2 h-8 px-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {backLabel}
              </Button>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{title}</h1>
            <p className="mt-2 text-zinc-500 text-lg max-w-3xl">{description}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:pt-12">
          {/* Status Selector */}
          <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 shadow-sm">
            <label htmlFor={statusId} className="text-sm font-medium text-zinc-500">
              Status:
            </label>
            <select
              id={statusId}
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-zinc-900 focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onSave('draft')}
              disabled={isSaving}
              className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button
              onClick={() => onSave('published')}
              disabled={isSaving || !isFormValid}
              className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Publish'}
            </Button>

            {showPublishAndView && onPublishAndView && (
              <Button
                variant="outline"
                onClick={onPublishAndView}
                disabled={isSaving || !isFormValid}
                className="border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
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
