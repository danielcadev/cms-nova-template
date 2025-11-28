'use client'

import {
  Clock,
  FileText,
  LayoutTemplate,
  MapPin,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  UtensilsCrossed,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminLoading } from '../AdminLoading'
import { TemplateCard } from './TemplateCard'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [recentContent, setRecentContent] = useState<RecentContent[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // State for real content counts
  const [contentCounts, setContentCounts] = useState({
    touristPlans: 0,
    experiences: 0,
    contentTypes: 0,
  })

  // Fetch real data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch tourist plans from API
        const plansResponse = await fetch('/api/plans')
        const experiencesResponse = await fetch('/api/experiences')

        let recentItems: RecentContent[] = []

        if (plansResponse.ok) {
          const plansData = await plansResponse.json()
          const plans = plansData.plans || []

          setContentCounts((prev) => ({
            ...prev,
            touristPlans: plans.length,
          }))

          const recentPlans: RecentContent[] = plans
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

          recentItems = recentItems.concat(recentPlans)
        }

        if (experiencesResponse.ok) {
          const experiencesData = await experiencesResponse.json()
          const experiences = experiencesData.experiences || []

          setContentCounts((prev) => ({
            ...prev,
            experiences: experiences.length,
          }))

          const recentExperiences: RecentContent[] = experiences
            .sort(
              (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
            .slice(0, 6)
            .map((experience: any) => ({
              id: experience.id,
              title: experience.title || 'Untitled Experience',
              type: 'Experience',
              status: experience.published ? 'published' : 'draft',
              createdAt: experience.createdAt,
              author: experience.hostName || 'Admin',
              route: `/experiencias/${experience.locationAlias}/${experience.slug}`,
            }))

          recentItems = recentItems.concat(recentExperiences)
        }

        if (recentItems.length) {
          recentItems.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          setRecentContent(recentItems.slice(0, 6))
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

  const templates: Template[] = [
    {
      id: '1',
      name: 'Tourism Plans',
      description: 'Complete structure for creating detailed travel itineraries and packages.',
      status: 'active',
      icon: FileText,
      category: 'Tourism',
      contentCount: contentCounts.touristPlans,
      route: '/admin/dashboard/templates/tourism',
    },
    {
      id: '2',
      name: 'Experiences',
      description: 'Story-driven journeys to highlight unique Colombian hosts and stories.',
      status: 'active',
      icon: MapPin,
      category: 'Tourism',
      contentCount: contentCounts.experiences,
      route: '/admin/dashboard/templates/experiences',
    },
    {
      id: '4',
      name: 'Flexible Content',
      description: 'Create completely customized content types for any data structure.',
      status: 'active',
      icon: PlusCircle,
      category: 'General',
      contentCount: contentCounts.contentTypes,
      route: '/admin/dashboard/content-types',
    },
    {
      id: '3',
      name: 'Restaurants',
      description: 'Template for menus, reservations and restaurant management.',
      status: 'coming-soon',
      icon: UtensilsCrossed,
      category: 'Food & Beverage',
      contentCount: 0,
    },
  ]

  // Filter templates
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  if (loading) {
    return (
      <AdminLoading
        title="Templates"
        message="Loading your templates..."
        variant="content"
        fullScreen
      />
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Templates</h1>
          <p className="text-zinc-500">Manage your content structure and create new entries.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 bg-white border-zinc-200 rounded-xl focus:ring-zinc-900"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/dashboard/content-types/create">
            <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Templates Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={idx}
                onViewDetails={() => {}} // Placeholder for now
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <div className="w-12 h-12 mx-auto bg-white rounded-xl border border-zinc-100 flex items-center justify-center mb-4 shadow-sm">
                <LayoutTemplate className="w-6 h-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-1">No templates found</h3>
              <p className="text-zinc-500 text-sm">
                Try adjusting your search terms or create a new template.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar: Recent Content & Info */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Template Structure
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              Templates define the structure of your content. You can use standard templates like{' '}
              <strong>Tourism Plans</strong> or create fully custom <strong>Content Types</strong>{' '}
              for any data structure.
            </p>
          </div>

          {/* Recent Content */}
          {recentContent.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900 text-sm">Recent Activity</h3>
                <Link
                  href="/admin/dashboard/templates/tourism"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-1">
                {recentContent.slice(0, 5).map((content) => (
                  <Link
                    key={content.id}
                    href={content.route}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                        {content.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{content.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(content.createdAt).toLocaleDateString(undefined, {
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
        </div>
      </div>
    </div>
  )
}

// Export additional components
export { EditTourismTemplate } from './EditTourismTemplate'
