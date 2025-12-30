'use client'

import { ArrowLeft, Eye, Loader2, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface TemplateHeaderProps {
    title: string
    subtitle?: string
    backHref: string
    onBack?: () => void
    onSave?: () => void
    onDelete?: () => void
    isSaving?: boolean
    isDeleting?: boolean
    saveLabel?: string
    savingLabel?: string
    deleteLabel?: string
    deletingLabel?: string
    canSave?: boolean
    status?: string
    onStatusChange?: (status: string) => void
    statusOptions?: {
        draft: string
        published: string
        archived?: string
    }
    leftActions?: ReactNode
    rightActions?: ReactNode
    onView?: () => void
    viewLabel?: string
}

export function TemplateHeader({
    title,
    subtitle,
    backHref,
    onBack,
    onSave,
    onDelete,
    isSaving,
    isDeleting,
    saveLabel = 'Publish',
    savingLabel = 'Publishing...',
    deleteLabel = 'Delete',
    deletingLabel = 'Deleting...',
    canSave = true,
    status,
    onStatusChange,
    statusOptions,
    leftActions,
    rightActions,
    onView,
    viewLabel = 'View',
}: TemplateHeaderProps) {
    return (
        <div className="sticky top-4 z-50 mb-8 px-2 sm:px-0">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-900/5 rounded-[2rem] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-900/10">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        asChild={!onBack}
                        onClick={onBack}
                        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-2xl h-11 w-11 p-0 flex items-center justify-center hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                    >
                        {onBack ? (
                            <ArrowLeft className="h-5 w-5" />
                        ) : (
                            <Link href={backHref}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        )}
                    </Button>

                    <div className="h-8 w-px bg-zinc-200/50 dark:bg-zinc-800/50 hidden sm:block" />

                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-1">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-none">
                                {subtitle}
                            </p>
                        )}
                    </div>


                    {onStatusChange && status && (
                        <div className="ml-2 flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</span>
                            <select
                                value={status}
                                onChange={(e) => onStatusChange(e.target.value)}
                                className="bg-transparent border-none text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer p-0 pr-6"
                            >
                                <option value="draft">{statusOptions?.draft || 'Draft'}</option>
                                <option value="published">{statusOptions?.published || 'Published'}</option>
                                {statusOptions?.archived && <option value="archived">{statusOptions.archived}</option>}
                            </select>
                        </div>
                    )}

                    {leftActions}
                </div>

                <div className="flex items-center gap-2">
                    {rightActions}

                    {onDelete && (
                        <Button
                            variant="outline"
                            onClick={onDelete}
                            disabled={isDeleting || isSaving}
                            className="rounded-2xl border-red-200/50 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20 h-11 px-6 font-medium transition-all"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            {isDeleting ? deletingLabel : deleteLabel}
                        </Button>
                    )}
                    {onSave && (
                        <Button
                            onClick={onSave}
                            disabled={isSaving || !canSave}
                            className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/20 h-11 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                        >
                            {isSaving ? (
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-5 w-5 mr-2" />
                            )}
                            {isSaving ? savingLabel : saveLabel}
                        </Button>
                    )}

                    {onView && (
                        <Button
                            variant="outline"
                            onClick={onView}
                            disabled={isSaving}
                            className="rounded-2xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 h-11 px-5 font-medium transition-all shadow-sm"
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            {viewLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
