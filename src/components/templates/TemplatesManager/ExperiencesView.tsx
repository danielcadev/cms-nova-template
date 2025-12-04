'use client'

import { Edit, ExternalLink, Plus, RefreshCw, Trash, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useConfirmation } from '@/hooks/useConfirmation'

import { useExperiences } from './useExperiences'

const DURATION_LABELS: Record<string, string> = {
  flexible: 'Flexible',
  'single-day': 'Single day',
  'multi-day': 'Multi-day',
  hourly: 'Hourly',
}

export function ExperiencesView() {
  const { experiences, isLoading, error, refreshExperiences, deleteExperience, togglePublished } =
    useExperiences()
  const { toast } = useToast()
  const confirmation = useConfirmation()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredExperiences = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return experiences
    return experiences.filter((experience) =>
      [
        experience.title,
        experience.location,
        experience.hostName,
        experience.duration,
        experience.durationType,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term)),
    )
  }, [experiences, searchTerm])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshExperiences()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleTogglePublished = async (id: string, next: boolean, title: string) => {
    const ok = await togglePublished(id, next)
    if (ok) {
      toast({
        title: next ? 'Experience published' : 'Experience reverted to draft',
        description: title,
      })
    } else {
      toast({
        title: 'Could not update status',
        description: 'Try again in a few seconds.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: string, title: string) => {
    confirmation.confirm(
      {
        title: 'Delete experience',
        description: `Are you sure you want to delete “${title}”? This action cannot be undone.`,
        confirmText: 'Delete experience',
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        const ok = await deleteExperience(id)
        if (ok) {
          toast({
            title: 'Experience deleted',
            description: `${title} was removed successfully.`,
          })
        } else {
          toast({
            title: 'Unable to delete experience',
            description: 'Please try again later.',
            variant: 'destructive',
          })
        }
      },
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                Experiences Library
              </h1>
              <p className="mt-2 text-zinc-500 text-lg max-w-3xl">
                Manage story-driven experiences with local hosts, activities, and regional
                highlights.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard/templates">
                <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">
                  Back to templates
                </Button>
              </Link>
              <Link href="/admin/dashboard/templates/experiences/create">
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Experience
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, city, or host..."
                className="w-full bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-zinc-500">Loading experiences...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
              {error}
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">No experiences found</h3>
              <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? `No results for "${searchTerm}". Try a different search term.`
                  : 'Start by creating your first experience to share with travelers.'}
              </p>
              {!searchTerm && (
                <Link href="/admin/dashboard/templates/experiences/create">
                  <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Experience
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredExperiences.map((experience) => {
                const publicPath = `/experiencias/${experience.locationAlias}/${experience.slug}`

                return (
                  <div
                    key={experience.id}
                    className="group bg-white rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-zinc-900 truncate">
                            {experience.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${experience.published
                                ? 'bg-zinc-900 text-white'
                                : 'bg-zinc-100 text-zinc-600'
                              }`}
                          >
                            {experience.published ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-zinc-700">Location:</span>
                            {experience.location ?? 'Pending'}
                          </div>
                          {experience.hostName && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-zinc-700">Host:</span>
                              {experience.hostName}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-zinc-700">Duration:</span>
                            {experience.duration ||
                              (experience.durationType
                                ? DURATION_LABELS[experience.durationType]
                                : 'Flexible')}
                          </div>
                        </div>

                        <div className="text-xs text-zinc-400">
                          Updated{' '}
                          {new Date(
                            experience.updatedAt || experience.createdAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:self-center">
                        <div className="flex items-center gap-2 bg-zinc-50 rounded-lg p-1 border border-zinc-100">
                          <Switch
                            checked={experience.published}
                            onCheckedChange={(next) =>
                              handleTogglePublished(experience.id, next, experience.title)
                            }
                            className="scale-75 data-[state=checked]:bg-zinc-900"
                          />
                          <span className="text-xs font-medium text-zinc-600 pr-2">
                            {experience.published ? 'Visible' : 'Hidden'}
                          </span>
                        </div>

                        <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/admin/dashboard/templates/experiences/edit/${experience.id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>

                          <Link href={publicPath} target="_blank" className="flex-1 sm:flex-none">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(experience.id, experience.title)}
                            className="text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {confirmation.config && (
          <ConfirmationModal
            isOpen={confirmation.isOpen}
            onClose={confirmation.close}
            onConfirm={confirmation.handleConfirm}
            config={confirmation.config}
          />
        )}
      </div>
    </div>
  )
}
