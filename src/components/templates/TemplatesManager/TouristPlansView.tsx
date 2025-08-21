'use client'

import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Edit,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { Input } from '@/components/ui/input'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { useToast } from '@/hooks/use-toast'

interface Plan {
  id: string
  mainTitle: string
  destination: string
  published: boolean
  createdAt: string | Date
}

interface TouristPlansViewProps {
  plans: Plan[]
  isLoading: boolean
  error: string | null
  onBack: () => void
  onDeletePlan: (planId: string) => Promise<void>
}

type ViewMode = 'list' | 'grid'
type SortField = 'title' | 'destination' | 'date' | 'status'
type SortOrder = 'asc' | 'desc'
type FilterStatus = 'all' | 'published' | 'draft'

export function TouristPlansView({
  plans,
  isLoading,
  error,
  onBack,
  onDeletePlan,
}: TouristPlansViewProps) {
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const router = useRouter()
  const { toast } = useToast()

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      return
    }

    try {
      setDeletingPlanId(planId)
      await onDeletePlan(planId)
      toast({
        title: 'Plan eliminado',
        description: 'El plan ha sido eliminado exitosamente.',
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el plan. Inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setDeletingPlanId(null)
    }
  }

  const handleEditPlan = (planId: string) => {
    router.push(`/admin/dashboard/templates/tourism/edit/${planId}`)
  }

  const handleCreatePlan = () => {
    router.push('/admin/dashboard/templates/tourism/create')
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Filtered and sorted plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = plans

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (plan) =>
          plan.mainTitle.toLowerCase().includes(query) ||
          plan.destination.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((plan) =>
        filterStatus === 'published' ? plan.published : !plan.published,
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'title':
          aValue = a.mainTitle.toLowerCase()
          bValue = b.mainTitle.toLowerCase()
          break
        case 'destination':
          aValue = a.destination.toLowerCase()
          bValue = b.destination.toLowerCase()
          break
        case 'date':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'status':
          aValue = a.published ? 1 : 0
          bValue = b.published ? 1 : 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [plans, searchQuery, filterStatus, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Cover Header */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <ThemedButton
                variantTone="ghost"
                onClick={onBack}
                className="mt-1 px-3 py-2 theme-text hover:theme-text-secondary"
              >
                <ArrowLeft className="h-4 w-4 mr-2 theme-text" strokeWidth={1.5} />
                Templates
              </ThemedButton>
              <div>
                <p className="text-sm theme-text-muted mb-2">Tourism</p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                  Tourist Plans
                </h1>
                <p className="mt-2 theme-text-secondary max-w-xl">
                  Create and manage your tourism plans and itineraries with a clean, organized
                  workspace.
                </p>
              </div>
            </div>
            <ThemedButton onClick={handleCreatePlan} className="shrink-0">
              <Plus className="h-4 w-4 mr-2 theme-text" strokeWidth={1.5} />
              Create plan
            </ThemedButton>
          </div>
        </div>

        {/* Navigation and Search Bar */}
        {plans.length > 0 && (
          <div className="rounded-xl border theme-border theme-card p-4 space-y-4">
            {/* Search and Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-text-muted" />
                  <Input
                    placeholder="Search plans by title or destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 theme-card theme-text border theme-border"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 theme-text-muted" />
                  <div className="flex rounded-lg border theme-border overflow-hidden">
                    {(['all', 'published', 'draft'] as FilterStatus[]).map((status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          filterStatus === status
                            ? 'theme-card-hover theme-text'
                            : 'theme-card theme-text-secondary hover:theme-text'
                        }`}
                      >
                        {status === 'all' ? 'All' : status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Mode and Sort */}
              <div className="flex items-center gap-3">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-xs theme-text-muted">Sort by:</span>
                  <div className="flex rounded-lg border theme-border overflow-hidden">
                    {[
                      { field: 'date' as SortField, label: 'Date' },
                      { field: 'title' as SortField, label: 'Title' },
                      { field: 'destination' as SortField, label: 'Destination' },
                      { field: 'status' as SortField, label: 'Status' },
                    ].map(({ field, label }) => (
                      <button
                        type="button"
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
                          sortField === field
                            ? 'theme-card-hover theme-text'
                            : 'theme-card theme-text-secondary hover:theme-text'
                        }`}
                      >
                        {label}
                        {sortField === field &&
                          (sortOrder === 'asc' ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex rounded-lg border theme-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'theme-card-hover theme-text'
                        : 'theme-card theme-text-secondary hover:theme-text'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'theme-card-hover theme-text'
                        : 'theme-card theme-text-secondary hover:theme-text'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm theme-text-muted border-t theme-border pt-3">
              <span>
                Showing {filteredAndSortedPlans.length} of {plans.length} plans
                {searchQuery && ` for "${searchQuery}"`}
                {filterStatus !== 'all' && ` • ${filterStatus} only`}
              </span>
              {filteredAndSortedPlans.length > 0 && (
                <span>
                  Sorted by {sortField} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20 p-6">
            <div className="text-red-800 dark:text-red-200">
              <h3 className="font-semibold mb-2">Error loading plans</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Plans Content */}
        {filteredAndSortedPlans.length === 0 && plans.length === 0 && !error ? (
          <div className="rounded-xl border theme-border theme-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg theme-bg-secondary flex items-center justify-center">
              <MapPin className="w-8 h-8 theme-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold theme-text mb-2">No plans yet</h3>
            <p className="theme-text-secondary mb-6 max-w-md mx-auto">
              Create your first tourism plan to get started. Build beautiful itineraries and manage
              your travel content.
            </p>
            <ThemedButton onClick={handleCreatePlan}>
              <Plus className="h-4 w-4 mr-2 theme-text" strokeWidth={1.5} />
              Create your first plan
            </ThemedButton>
          </div>
        ) : filteredAndSortedPlans.length === 0 ? (
          <div className="rounded-xl border theme-border theme-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg theme-bg-secondary flex items-center justify-center">
              <Search className="w-8 h-8 theme-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold theme-text mb-2">No plans found</h3>
            <p className="theme-text-secondary mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No plans match "${searchQuery}". Try adjusting your search or filters.`
                : `No ${filterStatus} plans found. Try changing your filter.`}
            </p>
            <div className="flex gap-3 justify-center">
              {searchQuery && (
                <ThemedButton variantTone="ghost" onClick={() => setSearchQuery('')}>
                  Clear search
                </ThemedButton>
              )}
              {filterStatus !== 'all' && (
                <ThemedButton variantTone="ghost" onClick={() => setFilterStatus('all')}>
                  Show all plans
                </ThemedButton>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* List View */}
            {viewMode === 'list' && (
              <div className="divide-y theme-border rounded-xl border theme-border overflow-hidden theme-card">
                {filteredAndSortedPlans.map((plan) => (
                  <div key={plan.id} className="group">
                    <div className="flex items-center justify-between p-4 md:p-5 hover:theme-card-hover transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg theme-bg-secondary flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 theme-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="text-sm font-medium theme-text truncate">
                              {plan.mainTitle}
                            </div>
                            <div
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                plan.published
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                            >
                              {plan.published ? 'Published' : 'Draft'}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs theme-text-muted">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 theme-text-muted" />
                              {plan.destination}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 theme-text-muted" />
                              {formatDate(plan.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <ThemedButton
                          variantTone="ghost"
                          onClick={() => handleEditPlan(plan.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs theme-text hover:theme-text-secondary"
                        >
                          <Edit className="h-3 w-3 mr-1 theme-text" />
                          Edit
                        </ThemedButton>
                        <ThemedButton
                          variantTone="ghost"
                          onClick={() => handleDeletePlan(plan.id)}
                          disabled={deletingPlanId === plan.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          {deletingPlanId === plan.id ? (
                            <div className="w-3 h-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                              Delete
                            </>
                          )}
                        </ThemedButton>
                        <ChevronRight className="h-4 w-4 theme-text-secondary group-hover:theme-text-muted ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group rounded-xl border theme-border theme-card p-6 hover:theme-card-hover transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg theme-bg-secondary flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 theme-text-secondary" />
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          plan.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {plan.published ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold theme-text mb-2 line-clamp-2 text-lg">
                        {plan.mainTitle}
                      </h3>
                      <div className="flex items-center gap-2 theme-text-muted text-sm mb-2">
                        <MapPin className="h-4 w-4" />
                        {plan.destination}
                      </div>
                      <div className="flex items-center gap-2 theme-text-muted text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(plan.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t theme-border">
                      <ThemedButton
                        variantTone="outline"
                        onClick={() => handleEditPlan(plan.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit className="h-4 w-4 theme-text" />
                        Edit
                      </ThemedButton>
                      <ThemedButton
                        variantTone="ghost"
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={deletingPlanId === plan.id}
                        className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {deletingPlanId === plan.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </ThemedButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
