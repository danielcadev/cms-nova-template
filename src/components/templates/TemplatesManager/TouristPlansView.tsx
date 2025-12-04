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
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
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

    // Sort by date desc
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return filtered
  }, [plans, searchQuery])

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Tourist Plans</h1>
            <p className="text-zinc-500 mt-1">
              Create and manage your tourism plans and itineraries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-auto px-4"
            >
              <Link href="/admin/dashboard/templates">
                Back to templates
              </Link>
            </Button>
            <Button
              onClick={handleCreatePlan}
              className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 h-auto px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <MapPin className="w-32 h-32 text-zinc-900" />
          </div>
          <div className="relative z-10">
            <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500" />
              Tourist Plans
            </h3>
            <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
              Manage comprehensive travel plans, including itineraries, pricing, and details.
              These plans are the core of your tourism offerings.
            </p>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Input
              placeholder="Search plans by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border-zinc-200 bg-white pl-4 h-11 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
            />
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-11"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
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
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Loading your tourism plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
              <MapPin className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No plans found</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
              {searchQuery
                ? `No plans match "${searchQuery}".`
                : 'Create your first tourism plan to get started.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreatePlan} className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
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
                      className="flex-1 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
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
