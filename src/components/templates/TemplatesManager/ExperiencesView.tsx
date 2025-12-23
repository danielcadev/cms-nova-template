'use client'

import { Edit, ExternalLink, MapPin, Plus, RefreshCw, Trash, Wand2, ArrowLeft, Layout, X, Check, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('templates.experiences')
  const baseT = useTranslations('templates.form')
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
        title: next ? t('toggle.published') : t('toggle.draft'),
        description: title,
      })
    } else {
      toast({
        title: 'Error',
        description: t('toggle.error'),
        variant: 'destructive',
      })
    }
  }

  const handleDelete = (id: string, title: string) => {
    confirmation.confirm(
      {
        title: t('delete.title'),
        description: t('delete.description', { title }),
        confirmText: t('delete.confirm'),
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        const ok = await deleteExperience(id)
        if (ok) {
          toast({
            title: t('delete.success'),
            description: title,
          })
        } else {
          toast({
            title: 'Error',
            description: t('delete.error'),
            variant: 'destructive',
          })
        }
      },
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                asChild
                className="rounded-2xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-10 w-10 p-0"
                title={baseT('back')}
              >
                <Link href="/admin/dashboard/templates">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('title')}</h1>
            </div>
            <p className="text-zinc-500 ml-13">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 h-11 px-6 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/admin/dashboard/templates/experiences/create">
                <Plus className="h-5 w-5 mr-2" />
                {t('createExperience')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Info Card - Consistent with TouristPlansView */}
        <div className="bg-zinc-900/5 border border-zinc-200 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layout className="w-32 h-32 text-zinc-900" />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-zinc-100 hidden sm:block">
              <Layout className="h-6 w-6 text-zinc-900" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                {t('info.title')}
              </h3>
              <p className="text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed font-medium">
                {t('info.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Refresh - Redesigned */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="rounded-2xl border-zinc-200 bg-white pl-11 h-12 shadow-sm focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-2xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-12 px-6 font-medium shadow-sm transition-all"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {baseT('refresh') || 'Refresh'}
          </Button>
        </div>

        {/* Content */}
        <div>
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-zinc-500">Loading experiences...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 shadow-sm flex items-center justify-center gap-3 font-medium">
              <X className="h-5 w-5" />
              {error}
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
              <div className="w-20 h-20 mx-auto bg-white rounded-3xl flex items-center justify-center mb-6 shadow-md border border-zinc-100">
                <Layout className="w-10 h-10 text-zinc-200" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                {searchTerm ? t('noResults', { query: searchTerm }) : t('noExperiences')}
              </h3>
              <p className="text-zinc-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                {searchTerm ? t('noResultsDesc') : t('noExperiencesDesc')}
              </p>
              {!searchTerm && (
                <Button asChild className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 px-10 py-7 text-lg font-bold transition-all hover:scale-[1.05] active:scale-[0.95]">
                  <Link href="/admin/dashboard/templates/experiences/create">
                    <Plus className="h-6 w-6 mr-3" strokeWidth={3} />
                    {t('createExperience')}
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => {
                const publicPath = `/experiencias/${experience.locationAlias}/${experience.slug}`

                return (
                  <div
                    key={experience.id}
                    className="group relative flex flex-col bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-900/5 hover:border-zinc-300 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 group-hover:scale-110 group-hover:bg-zinc-100 transition-all duration-300">
                        <Wand2 className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={experience.published}
                          onCheckedChange={(next) =>
                            handleTogglePublished(experience.id, next, experience.title)
                          }
                          className="scale-75 data-[state=checked]:bg-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="mb-4 flex-1">
                      <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors line-clamp-1">
                        {experience.title}
                      </h3>
                      <div className="flex flex-col gap-1 text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {experience.location ?? 'Pending'}
                        </div>
                        {experience.hostName && (
                          <div className="text-xs text-zinc-400">
                            Host: {experience.hostName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="flex-1 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                          <Link href={publicPath} target="_blank">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            View
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="flex-1 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                          <Link href={`/admin/dashboard/templates/experiences/edit/${experience.id}`}>
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(experience.id, experience.title)}
                          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
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
