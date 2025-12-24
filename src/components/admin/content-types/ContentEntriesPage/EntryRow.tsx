import { Calendar, Edit, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200 hover:shadow-lg hover:shadow-zinc-900/5 hover:border-zinc-300 transition-all duration-300">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                        <FileText className="h-6 w-6 text-zinc-400 group-hover:text-zinc-600" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-zinc-900 text-base mb-1">
                            {getEntryTitle(entry)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                            <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                <span className="text-xs font-medium">
                                    {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold border ${entry.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : entry.status === 'draft'
                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
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
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                    >
                        <Link
                            href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/${entry.id}`}
                        >
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        className="h-9 w-9 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
