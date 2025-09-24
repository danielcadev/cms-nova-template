'use client'

import {
  ArrowRight,
  Clock,
  FileText,
  MapPin,
  Plus,
  PlusCircle,
  RefreshCw,
  UtensilsCrossed,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ThemedButton } from '@/components/ui/ThemedButton'
import { AdminLoading } from '../AdminLoading'

export interface Template {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'coming-soon'
  icon: any
  category: string
  contentCount?: number
  route?: string
}

interface RecentContent {
  id: string
  title: string
  type: string
  status: 'published' | 'draft'
  createdAt: string
  author: string
  route: string
}

export function TemplatesPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, _setSearchTerm] = useState('')
  const [recentContent, setRecentContent] = useState<RecentContent[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch real data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch tourist plans from API
        const plansResponse = await fetch('/api/plans')
        if (plansResponse.ok) {
          const plansData = await plansResponse.json()
          const plans = plansData.plans || []

          // Update content counts
          setContentCounts((prev) => ({
            ...prev,
            touristPlans: plans.length,
          }))

          // Transform plans data to recent content format
          const recentPlans = plans
            .sort(
              (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
            .slice(0, 6)
            .map((plan: any) => ({
              id: plan.id,
              title: plan.mainTitle || 'Untitled Plan',
              type: 'Tourism Plan',
              status: plan.published ? 'published' : 'draft',
              createdAt: plan.createdAt,
              author: 'Admin',
              route: `/admin/dashboard/templates/tourism/edit/${plan.id}`,
            }))

          setRecentContent(recentPlans)
        } else {
          console.error('Error fetching plans:', plansResponse.statusText)
        }

        // Fetch content types count
        try {
          const contentTypesResponse = await fetch('/api/content-types')
          if (contentTypesResponse.ok) {
            const contentTypesData = await contentTypesResponse.json()
            const contentTypes = contentTypesData.contentTypes || []

            setContentCounts((prev) => ({
              ...prev,
              contentTypes: contentTypes.length,
            }))
          }
        } catch (error) {
          console.error('Error fetching content types:', error)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // State for real content counts
  const [contentCounts, setContentCounts] = useState({
    touristPlans: 0,
    contentTypes: 0,
  })

  const templates: Template[] = [
    {
      id: '1',
      name: 'Tourism Plans',
      description: 'Complete structure for creating detailed travel itineraries',
      status: 'active',
      icon: FileText,
      category: 'Tourism',
      contentCount: contentCounts.touristPlans,
      route: '/admin/dashboard/templates/tourism',
    },
    {
      id: '2',
      name: 'Restaurants',
      description: 'Template for menus and restaurant management',
      status: 'coming-soon',
      icon: UtensilsCrossed,
      category: 'Food & Beverage',
      contentCount: 0,
    },
    {
      id: '3',
      name: 'Flexible Content',
      description: 'Create completely customized content types',
      status: 'active',
      icon: PlusCircle,
      category: 'General',
      contentCount: contentCounts.contentTypes,
      route: '/admin/dashboard/content-types',
    },
  ]

  // Filter templates
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Stats
  const _stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === 'active').length,
    comingSoon: templates.filter((t) => t.status === 'coming-soon').length,
    totalContent: templates.reduce((acc, t) => acc + (t.contentCount || 0), 0),
  }

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Reload the page data
    window.location.reload()
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title="Templates"
          message="Loading your templates..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-8 py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-sm theme-text-muted mb-2">Library</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Templates
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Manage your templates and the content created from them. Plans and Circuits routes
                are optional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium theme-text-secondary rounded-lg border theme-border theme-card backdrop-blur-sm hover:theme-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto justify-center"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link href="/admin/dashboard/content-types/create" className="w-full sm:w-auto">
                <ThemedButton className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border theme-border theme-card theme-text hover:theme-card-hover transition-colors w-full justify-center">
                  <Plus className="h-4 w-4" />
                  New template
                </ThemedButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Info: Optional routes */}
        <div className="mb-8 p-4 rounded-lg border theme-border theme-card">
          <h3 className="text-sm font-medium theme-text">Optional public routes</h3>
          <p className="text-sm theme-text-secondary mt-2">
            You can use Nova as pure headless CMS or enable the starter templates. The public routes
            for <span className="font-medium">Plans</span> and{' '}
            <span className="font-medium">Circuits</span> are optional and controlled by feature
            flags. Headless routes use <code>/[typePath]</code> and <code>/[typePath]/[slug]</code>.
          </p>
          <ol className="mt-3 space-y-2 text-sm theme-text-secondary list-decimal list-inside">
            <li>
              To show Plans, leave <code>features.plans = true</code> (default).
            </li>
            <li>
              To show Circuits, set <code>features.circuitos = true</code>.
            </li>
            <li>
              To expose headless routes publicly, use <code>features.publicTypePaths = true</code>.
            </li>
          </ol>
        </div>

        {/* Recent Content */}
        {recentContent.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Recent Content
              </h2>
              <Link href="/admin/dashboard/templates/tourism">
                <ThemedButton
                  variantTone="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  View all
                  <ArrowRight className="h-3 w-3 ml-1" />
                </ThemedButton>
              </Link>
            </div>

            <div className="space-y-2">
              {recentContent.slice(0, 5).map((content) => (
                <Link key={content.id} href={content.route}>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-800 bg-white/40 dark:bg-gray-900/40 hover:bg-white/60 dark:hover:bg-gray-900/60 backdrop-blur-[2px] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {content.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {content.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          content.status === 'published'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {content.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(content.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Templates Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
            Available Templates
          </h2>

          {/* Templates list */}
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="group">
                {template.route ? (
                  <Link href={template.route}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <template.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {template.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {template.contentCount !== undefined && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {template.contentCount} items
                          </span>
                        )}
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.status === 'active'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {template.status === 'active' ? 'Active' : 'Coming Soon'}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-[2px] opacity-70">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <template.icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                          {template.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchTerm ? `No templates match "${searchTerm}"` : 'No templates available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Export additional components
export { EditTourismTemplate } from './EditTourismTemplate'
