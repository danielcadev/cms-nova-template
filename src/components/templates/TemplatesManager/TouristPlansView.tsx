'use client'

import {
  Calendar,
  Copy,
  Edit,
  Grid3X3,
  List,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
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

type ViewMode = 'list' | 'grid'
type FilterStatus = 'all' | 'published' | 'draft'

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
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const router = useRouter()
  const { toast } = useToast()
  const confirmation = useConfirmation()

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    const planTitle = plan?.mainTitle || 'this plan'

    confirmation.confirm(
      {
        title: 'Delete Plan',
        description: `Are you sure you want to delete "${planTitle}"?\n\nThis action cannot be undone and all plan information will be permanently removed.`,
        confirmText: 'Delete Plan',
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
            title: 'Plan deleted',
            description: `"${planTitle}" has been successfully deleted.`,
          })
        } catch (_error) {
          toast({
            title: 'Error',
            description: 'Could not delete the plan. Please try again.',
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
        title: 'Plan duplicated',
        description: `"${planTitle}" was duplicated as a draft.`,
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Could not duplicate the plan. Please try again.',
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
        title: plan.published ? 'Plan reverted to draft' : 'Plan published',
        description: plan.mainTitle,
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Could not update plan status. Please try again.',
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
        title: 'Could not sync list',
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

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((plan) =>
        filterStatus === 'published' ? plan.published : !plan.published,
      )
    }

    // Sort by date desc
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return filtered
  }, [plans, searchQuery, filterStatus])

  // Loading state
  if (isLoading) {
    return (
      <div className="relative">
        <AdminLoading
          title="Tourist Plans"
          message="Loading your tourism plans..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Tourist Plans</h1>
              <p className="mt-2 text-zinc-500 text-lg max-w-3xl">
                Create and manage your tourism plans and itineraries with a clean, organized
                workspace.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard/templates">
                <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">
                  Back to templates
                </Button>
              </Link>
              <Button
                onClick={handleCreatePlan}
                className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search plans by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 w-full"
                />
              </div>

              {/* Status Filter */}
              <div className="flex rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 p-1 gap-1">
                {(['all', 'published', 'draft'] as FilterStatus[]).map((status) => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                      filterStatus === status
                        ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onRefresh && (
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                      : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                      : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 mb-6">
            <div className="text-red-800">
              <h3 className="font-semibold mb-2">Error loading plans</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Plans Content */}
        {filteredPlans.length === 0 && plans.length === 0 && !error ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No plans yet</h3>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Create your first tourism plan to get started. Build beautiful itineraries and manage
              your travel content.
            </p>
            <Button onClick={handleCreatePlan} className="bg-zinc-900 text-white hover:bg-zinc-800">
              <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Create your first plan
            </Button>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No plans found</h3>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No plans match "${searchQuery}". Try adjusting your search or filters.`
                : `No ${filterStatus} plans found. Try changing your filter.`}
            </p>
            <div className="flex gap-3 justify-center">
              {searchQuery && (
                <Button variant="ghost" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              )}
              {filterStatus !== 'all' && (
                <Button variant="ghost" onClick={() => setFilterStatus('all')}>
                  Show all plans
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* List View */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-3">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                          <MapPin className="h-6 w-6 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h3 className="text-base font-semibold text-zinc-900 truncate">
                              {plan.mainTitle}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plan.published
                                  ? 'bg-zinc-900 text-white'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {plan.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(plan.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-2 bg-zinc-50 rounded-lg p-1 border border-zinc-100">
                          <Switch
                            checked={plan.published}
                            disabled={togglingPlanId === plan.id}
                            onCheckedChange={() => handleTogglePublished(plan)}
                            className="scale-75 data-[state=checked]:bg-zinc-900"
                          />
                          <span className="text-xs font-medium text-zinc-600 pr-2">
                            {plan.published ? 'Visible' : 'Hidden'}
                          </span>
                        </div>

                        <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                        <div className="flex items-center gap-1">
                          {onDuplicatePlan && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDuplicatePlan(plan.id)}
                              disabled={duplicatingPlanId === plan.id}
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
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
                            size="icon"
                            onClick={() => handleEditPlan(plan.id)}
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={deletingPlanId === plan.id}
                            className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
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
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                        <MapPin className="h-6 w-6 text-zinc-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            plan.published ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {plan.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-zinc-900 mb-2 line-clamp-2 text-lg">
                        {plan.mainTitle}
                      </h3>

                      <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(plan.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={plan.published}
                          disabled={togglingPlanId === plan.id}
                          onCheckedChange={() => handleTogglePublished(plan)}
                          className="scale-75 data-[state=checked]:bg-zinc-900"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPlan(plan.id)}
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {onDuplicatePlan && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicatePlan(plan.id)}
                            disabled={duplicatingPlanId === plan.id}
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                          >
                            {duplicatingPlanId === plan.id ? (
                              <div className="w-3 h-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePlan(plan.id)}
                          disabled={deletingPlanId === plan.id}
                          className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
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
