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
      {/* Cover */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
        <div className="relative p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Link href={backUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="border border-gray-200 dark:border-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> {backLabel}
              </Button>
            </Link>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Edit content</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl">{description}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 ml-auto">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor={statusId}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status:
              </label>
              <select
                id={statusId}
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button variant="outline" onClick={() => onSave('draft')} disabled={isSaving}>
                Save as draft
              </Button>
              <Button onClick={() => onSave('published')} disabled={isSaving || !isFormValid}>
                <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Publish'}
              </Button>
              {showPublishAndView && onPublishAndView && (
                <Button onClick={onPublishAndView} disabled={isSaving || !isFormValid}>
                  <Eye className="h-4 w-4 mr-2" /> {isSaving ? 'Publishing...' : 'Publish & view'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Optional URL Preview */}
      {showUrlPreview && currentUrl && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <div className="p-4 md:p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Current URL
              </h3>
              <div className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                {currentUrl}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(currentUrl)}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm transition-colors"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
