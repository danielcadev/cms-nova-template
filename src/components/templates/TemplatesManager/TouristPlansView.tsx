'use client'

import {
  Calendar,
  Copy,
  Edit,
  ExternalLink,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  ArrowLeft,
  Layout,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useConfirmation } from '@/hooks/useConfirmation'

interface Plan {
  id: string
  mainTitle: string
  published: boolean
  createdAt: string | Date
}

interface TouristPlansViewProps {
  plans: Plan[]
  isLoading: boolean
  error: string | null
  onBack: () => void
  onDeletePlan: (planId: string) => Promise<boolean | undefined>
  onDuplicatePlan?: (planId: string) => Promise<Plan | null | undefined>
  onTogglePublished?: (planId: string, nextState: boolean) => Promise<boolean>
  onRefresh?: () => Promise<unknown>
  isRefreshing?: boolean
}

export function TouristPlansView({
  plans,
  isLoading,
  error,
  onBack: _onBack,
  onDeletePlan,
  onDuplicatePlan,
  onTogglePublished,
  onRefresh,
  isRefreshing = false,
}: TouristPlansViewProps) {
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null)
  const [duplicatingPlanId, setDuplicatingPlanId] = useState<string | null>(null)
  const [togglingPlanId, setTogglingPlanId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const t = useTranslations('templates.tourism')
  const baseT = useTranslations('templates.form')
  const router = useRouter()
  const { toast } = useToast()
  const confirmation = useConfirmation()

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    const planTitle = plan?.mainTitle || 'this plan'

    confirmation.confirm(
      {
        title: t('delete.title'),
        description: t('delete.description', { title: planTitle }),
        confirmText: t('delete.confirm'),
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        try {
          setDeletingPlanId(planId)
          const result = await onDeletePlan(planId)
          if (result === false) {
            throw new Error('Delete failed')
          }
          toast({
            title: t('delete.success'),
            description: `"${planTitle}"`,
          })
        } catch (_error) {
          toast({
            title: 'Error',
            description: t('delete.error'),
            variant: 'destructive',
          })
          throw _error
        } finally {
          setDeletingPlanId(null)
        }
      },
    )
  }

  const handleEditPlan = (planId: string) => {
    router.push(`/admin/dashboard/templates/tourism/edit/${planId}`)
  }

  const handleDuplicatePlan = async (planId: string) => {
    if (!onDuplicatePlan) return
    const plan = plans.find((p) => p.id === planId)
    const planTitle = plan?.mainTitle || 'this plan'
    try {
      setDuplicatingPlanId(planId)
      const duplicated = await onDuplicatePlan(planId)
      if (!duplicated) {
        throw new Error('Duplicate failed')
      }
      toast({
        title: t('duplicate.success', { title: planTitle }),
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: t('duplicate.error'),
        variant: 'destructive',
      })
    } finally {
      setDuplicatingPlanId(null)
    }
  }

  const handleTogglePublished = async (plan: Plan) => {
    if (!onTogglePublished) return
    try {
      setTogglingPlanId(plan.id)
      const success = await onTogglePublished(plan.id, !plan.published)
      if (!success) {
        throw new Error('Toggle failed')
      }
      toast({
        title: plan.published ? t('toggle.draft') : t('toggle.published'),
        description: plan.mainTitle,
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: t('toggle.error'),
        variant: 'destructive',
      })
    } finally {
      setTogglingPlanId(null)
    }
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    try {
      await onRefresh()
    } catch (_error) {
      toast({
        title: t('errorLoading'),
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleCreatePlan = () => {
    router.push('/admin/dashboard/templates/tourism/create')
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Filtered and sorted plans
  const filteredPlans = useMemo(() => {
    let filtered = plans

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((plan) => plan.mainTitle.toLowerCase().includes(query))
    }

    // Sort by date desc
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return filtered
  }, [plans, searchQuery])

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
                title={t('backToTemplates')}
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
              onClick={handleCreatePlan}
              className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 h-11 px-6 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t('createPlan')}
            </Button>
          </div>
        </div>

        {/* Info Card - Improved contrast and localized */}
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
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="rounded-2xl border-zinc-200 bg-white pl-11 h-12 shadow-sm focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
            />
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-2xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-12 px-6 font-medium shadow-sm transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="text-red-800 flex items-center gap-3">
              <X className="h-5 w-5" />
              <div>
                <h3 className="font-bold">{t('errorLoading')}</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
            <div className="animate-spin w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full mx-auto mb-4" />
            <p className="text-zinc-500 font-medium tracking-tight bounce-in">{t('loading')}</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-20 h-20 mx-auto bg-white rounded-3xl flex items-center justify-center mb-6 shadow-md border border-zinc-100 group-hover:scale-110 transition-transform duration-500">
              <MapPin className="w-10 h-10 text-zinc-200" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">
              {searchQuery ? t('noPlansMatch', { query: searchQuery }) : t('noPlans')}
            </h3>
            <p className="text-zinc-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? t('noTemplatesDesc')
                : t('noPlansDesc')}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreatePlan} className="rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 px-10 py-7 text-lg font-bold transition-all hover:scale-[1.05] active:scale-[0.95]">
                <Plus className="h-6 w-6 mr-3" strokeWidth={3} />
                {t('createPlan')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="group relative flex flex-col bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-900/5 hover:border-zinc-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 group-hover:scale-110 group-hover:bg-zinc-100 transition-all duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={plan.published}
                      disabled={togglingPlanId === plan.id}
                      onCheckedChange={() => handleTogglePublished(plan)}
                      className="scale-75 data-[state=checked]:bg-zinc-900"
                    />
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors line-clamp-2">
                    {plan.mainTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(plan.createdAt)}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 w-full">
                    {onDuplicatePlan && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicatePlan(plan.id)}
                        disabled={duplicatingPlanId === plan.id}
                        className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                        title="Duplicate"
                      >
                        {duplicatingPlanId === plan.id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlan(plan.id)}
                      className="flex-1 h-9 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-semibold"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {baseT('edit') || 'Edit'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={deletingPlanId === plan.id}
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      {deletingPlanId === plan.id ? (
                        <div className="w-3 h-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmation.config && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.handleConfirm}
          config={confirmation.config}
        />
      )}
    </div>
  )
}
