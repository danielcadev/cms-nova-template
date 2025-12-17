import { Calendar, Edit, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ThemedButton } from '@/components/ui/ThemedButton'
import type { ContentEntry, ContentType } from './data'

interface EntryRowProps {
    entry: ContentEntry
    contentType: ContentType
    getEntryTitle: (entry: ContentEntry) => string
    handleDelete: (id: string) => void
}

export function EntryRow({ entry, contentType, getEntryTitle, handleDelete }: EntryRowProps) {
    return (
        <div className="group">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            {getEntryTitle(entry)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${entry.status === 'published'
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                    : entry.status === 'draft'
                                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {entry.status === 'published'
                                    ? 'Published'
                                    : entry.status === 'draft'
                                        ? 'Draft'
                                        : 'Archived'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemedButton
                        variantTone="ghost"
                        size="sm"
                        asChild
                        className="theme-text-secondary hover:theme-text"
                    >
                        <Link
                            href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/${entry.id}`}
                        >
                            <Edit className="h-4 w-4 mr-1 theme-text-secondary" /> Edit entry
                        </Link>
                    </ThemedButton>
                    <ThemedButton
                        variantTone="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 className="h-4 w-4" />
                    </ThemedButton>
                </div>
            </div>
        </div>
    )
}
