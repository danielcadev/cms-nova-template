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
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Cover */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-3 sm:mb-4 lg:mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
        <div className="relative p-3 sm:p-4 lg:p-6 xl:p-8 flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0">
            <Link href={backUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="border border-gray-200 dark:border-gray-800 text-xs sm:text-sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{backLabel}</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                Edit content
              </p>
              <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 line-clamp-2">
                {title}
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-xl line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4 ml-auto w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <label
                htmlFor={statusId}
                className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status:
              </label>
              <select
                id={statusId}
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-800 rounded-md sm:rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => onSave('draft')}
                disabled={isSaving}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Save as draft</span>
                <span className="sm:hidden">Draft</span>
              </Button>
              <Button
                onClick={() => onSave('published')}
                disabled={isSaving || !isFormValid}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Publish'}</span>
                <span className="sm:hidden">{isSaving ? 'Saving...' : 'Publish'}</span>
              </Button>
              {showPublishAndView && onPublishAndView && (
                <Button
                  onClick={onPublishAndView}
                  disabled={isSaving || !isFormValid}
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3 hidden sm:flex"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden lg:inline">
                    {isSaving ? 'Publishing...' : 'Publish & view'}
                  </span>
                  <span className="lg:hidden">{isSaving ? 'Publishing...' : 'View'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Optional URL Preview */}
      {showUrlPreview && currentUrl && (
        <div className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-3 sm:mb-4 lg:mb-6">
          <div className="p-3 sm:p-4 lg:p-5 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Current URL
              </h3>
              <div className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                {currentUrl}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(currentUrl)}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-xs sm:text-sm transition-colors flex-shrink-0 ml-2"
            >
              <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
