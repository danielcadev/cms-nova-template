import { ArrowRight, Database, Edit3, Eye, FileText, Layout, Plus } from 'lucide-react'
import Link from 'next/link'
import { ThemedButton } from '@/components/ui/ThemedButton'

export interface ContentType {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  _count: {
    entries: number
  }
  entries: any[]
}

export interface Plan {
  id: string
  mainTitle: string
  createdAt: Date
}

export interface ViewContentProps {
  contentTypes: ContentType[]
  plans: Plan[]
  allContentEntries: any[]
}

export function ViewContentComponent({ contentTypes, plans, allContentEntries }: ViewContentProps) {
  // Cálculos de métricas
  const _totalContent = allContentEntries?.length || 0
  const _totalTemplates = plans?.length || 0
  const _totalContentTypes = contentTypes?.length || 0

  // Plantillas recientes (últimas 3)
  const _recentTemplates = plans?.slice(0, 3) || []

  return (
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-sm theme-text-muted mb-2">Content</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                View content
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Manage, create and organize all your content from one place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
              <ThemedButton asChild className="w-full sm:w-auto justify-center">
                <Link href="/admin/dashboard/content-types">
                  <Database className="h-4 w-4 mr-2 theme-text" />
                  Content types
                </Link>
              </ThemedButton>
              <ThemedButton
                asChild
                className="theme-card theme-text border theme-border hover:theme-card-hover w-full sm:w-auto justify-center"
              >
                <Link href="/admin/dashboard/content-types/create">
                  <Plus className="h-4 w-4 mr-2 theme-text" />
                  New type
                </Link>
              </ThemedButton>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {/* Content Types */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Content Types
              </h2>
              <ThemedButton variantTone="ghost" size="sm" className="theme-text" asChild>
                <Link href="/admin/dashboard/content-types">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1 theme-text" />
                </Link>
              </ThemedButton>
            </div>

            {contentTypes.length === 0 ? (
              <div className="text-center py-12 border theme-border rounded-lg">
                <div className="w-12 h-12 mx-auto theme-bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 theme-text-secondary" />
                </div>
                <h3 className="text-lg font-medium theme-text mb-2">No content types yet</h3>
                <p className="theme-text-secondary text-sm mb-6">
                  Create your first content type to start managing content
                </p>
                <ThemedButton
                  asChild
                  className="theme-card theme-text border theme-border hover:theme-card-hover"
                >
                  <Link href="/admin/dashboard/content-types/create">
                    <Plus className="h-4 w-4 mr-2 theme-text" />
                    Create Content Type
                  </Link>
                </ThemedButton>
              </div>
            ) : (
              <div className="space-y-3">
                {contentTypes.slice(0, 5).map((contentType) => (
                  <div
                    key={contentType.id}
                    className="flex items-center justify-between p-4 rounded-lg border theme-border hover:theme-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 theme-bg-secondary rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 theme-text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium theme-text">{contentType.name}</div>
                        <div className="text-sm theme-text-secondary">
                          {contentType._count.entries} entries
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemedButton variantTone="ghost" size="sm" className="theme-text" asChild>
                        <Link
                          href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}
                        >
                          Content
                        </Link>
                      </ThemedButton>
                      <ThemedButton variantTone="ghost" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/edit`}
                        >
                          <Edit3 className="h-4 w-4 theme-text" />
                        </Link>
                      </ThemedButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Articles */}
          {allContentEntries.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Recent Content Types
                </h2>
                <ThemedButton variantTone="ghost" size="sm" className="theme-text" asChild>
                  <Link href="/admin/dashboard/content-types">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1 theme-text" />
                  </Link>
                </ThemedButton>
              </div>

              <div className="space-y-3">
                {allContentEntries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg border theme-border hover:theme-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 theme-bg-secondary rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 theme-text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium theme-text">
                          {entry.contentType?.name || 'Article'}
                        </div>
                        <div className="text-sm theme-text-secondary">
                          Content Type: {entry.contentType?.name || 'Unknown'} •{' '}
                          {new Date(entry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemedButton variantTone="ghost" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/content-types/${entry.contentType?.apiIdentifier || ''}/content`}
                        >
                          <Eye className="h-4 w-4 theme-text" />
                        </Link>
                      </ThemedButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Template Articles */}
        {plans.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Recent Template Articles
              </h2>
              <ThemedButton variantTone="ghost" size="sm" className="theme-text" asChild>
                <Link href="/admin/dashboard/templates/tourism">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1 theme-text" />
                </Link>
              </ThemedButton>
            </div>

            <div className="space-y-3">
              {plans.slice(0, 5).map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 rounded-lg border theme-border hover:theme-card-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 theme-bg-secondary rounded-lg flex items-center justify-center">
                      <Layout className="h-5 w-5 theme-text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium theme-text">{template.mainTitle}</div>
                      <div className="text-sm theme-text-secondary">
                        Template: Tourism •{' '}
                        {new Date(template.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemedButton variantTone="ghost" size="sm" asChild>
                      <Link href={`/admin/dashboard/templates/tourism/edit/${template.id}`}>
                        <Eye className="h-4 w-4 theme-text" />
                      </Link>
                    </ThemedButton>
                    <ThemedButton variantTone="ghost" size="sm" asChild>
                      <Link href={`/admin/dashboard/templates/tourism/edit/${template.id}`}>
                        <Edit3 className="h-4 w-4 theme-text" />
                      </Link>
                    </ThemedButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <ThemedButton
              className="justify-start h-12 theme-card theme-text border theme-border hover:theme-card-hover w-full"
              asChild
            >
              <Link href="/admin/dashboard/content-types/create">
                <Plus className="h-4 w-4 mr-3" />
                Create Content Type
              </Link>
            </ThemedButton>
            <ThemedButton
              asChild
              className="justify-start h-12 theme-card theme-text border theme-border hover:theme-card-hover w-full"
            >
              <Link href="/admin/dashboard/templates">
                <Layout className="h-4 w-4 mr-3 theme-text" />
                Create via Template
              </Link>
            </ThemedButton>
            <ThemedButton
              asChild
              className="justify-start h-12 theme-card theme-text border theme-border hover:theme-card-hover w-full md:col-span-3 sm:col-span-2"
            >
              <Link href="/admin/dashboard/content-types">
                <Database className="h-4 w-4 mr-3 theme-text" />
                Create via Content Type
              </Link>
            </ThemedButton>
          </div>
        </div>
      </div>
    </div>
  )
}
