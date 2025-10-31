'use client'

import { Edit, ExternalLink, LinkIcon, Plus, RefreshCw, Trash, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { useToast } from '@/hooks/use-toast'
import { useConfirmation } from '@/hooks/useConfirmation'

import { useExperiences } from './useExperiences'

const DURATION_LABELS: Record<string, string> = {
  flexible: 'Flexible',
  'single-day': 'Single day',
  'multi-day': 'Multi-day',
  hourly: 'Hourly',
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
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
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm theme-text-muted mb-2">Experiences</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Experiences Library
              </h1>
              <p className="mt-2 theme-text-secondary">
                Manage story-driven experiences with local hosts, activities, and regional
                highlights. This workspace mirrors Tourism Plans so you can publish immersive
                journeys quickly.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Link href="/admin/dashboard/templates" className="w-full sm:w-auto">
                <ThemedButton variantTone="ghost" size="sm" className="w-full sm:w-auto">
                  Back to templates
                </ThemedButton>
              </Link>
              <Link
                href="/admin/dashboard/templates/experiences/create"
                className="w-full sm:w-auto"
              >
                <ThemedButton className="inline-flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Create experience
                </ThemedButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border theme-border theme-card p-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold theme-text">Experiences workspace</h2>
              <p className="text-sm theme-text-secondary max-w-3xl mt-2">
                Collect titles, optional host bios, summaries, narratives, activities, schedules,
                and pricing guidance. Start from your client stories and enhance them with media to
                build unforgettable experiences.
              </p>
            </div>
            <Link href="/admin/dashboard/templates/experiences/create">
              <ThemedButton className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Start a new experience
              </ThemedButton>
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border theme-border theme-card">
          <div className="border-b theme-border px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold theme-text">Manage experiences</h3>
              <p className="text-sm theme-text-secondary">
                Control visibility, edit details, or remove entries from your library.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title, city, or host"
                  className="w-full"
                  aria-label="Search experiences"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>
          </div>
          <div className="px-6 py-6 space-y-3">
            {isLoading ? (
              <p className="text-sm theme-text-secondary">Loading experiences...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : filteredExperiences.length === 0 ? (
              <p className="text-sm theme-text-secondary">
                {searchTerm
                  ? `No experiences match “${searchTerm}”.`
                  : 'No experiences yet. Start by creating one above.'}
              </p>
            ) : (
              filteredExperiences.map((experience) => {
                const scheduleDays = Array.isArray(experience.scheduleDays)
                  ? (experience.scheduleDays as string[])
                  : []
                const publicPath = `/experiencias/${experience.locationAlias}/${experience.slug}`

                return (
                  <div
                    key={experience.id}
                    className="rounded-xl border theme-border px-4 py-4 lg:px-6 lg:py-5 theme-card hover:theme-card-hover transition"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold theme-text truncate">
                            {experience.title}
                          </h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              experience.published
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                            }`}
                          >
                            {experience.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="text-xs theme-text-secondary space-x-1">
                          <span>{experience.location ?? 'City pending'}</span>
                          {experience.hostName && <span>· Host: {experience.hostName}</span>}
                        </div>
                        <div className="text-xs theme-text-secondary space-x-1">
                          {experience.durationType && (
                            <span>{DURATION_LABELS[experience.durationType] ?? 'Flexible'}</span>
                          )}
                          {experience.duration && <span>· {experience.duration}</span>}
                          {scheduleDays.length > 0 && (
                            <span>
                              · {scheduleDays.map((day) => DAY_LABELS[day] ?? day).join(', ')}
                            </span>
                          )}
                          {experience.schedule && <span>· {experience.schedule}</span>}
                        </div>
                        <div className="text-xs theme-text-muted">
                          Created on {new Date(experience.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={experience.published}
                            onCheckedChange={(next) =>
                              handleTogglePublished(experience.id, next, experience.title)
                            }
                            aria-label={`Toggle published state for ${experience.title}`}
                          />
                          <span className="text-xs theme-text-secondary">
                            {experience.published ? 'Visible' : 'Draft only'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/dashboard/templates/experiences/edit/${experience.id}`}
                          >
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <Link href={publicPath} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                              <ExternalLink className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-500/10"
                            onClick={() => handleDelete(experience.id, experience.title)}
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                        <div className="flex lg:hidden items-center gap-1 text-xs text-primary">
                          <Link href={publicPath} className="inline-flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            {experience.slug}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
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
