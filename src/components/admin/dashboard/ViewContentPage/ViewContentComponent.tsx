import { ArrowRight, Database, Edit3, Eye, FileText, Layout, Plus } from 'lucide-react'
import Link from 'next/link'

export interface ContentType {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  _count: {
    entries: number
  }
  entries?: any[]
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

export function ViewContentComponent({
  contentTypes,
  plans: _plans,
  allContentEntries,
}: ViewContentProps) {
  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Content Management</h1>
          <p className="text-zinc-500 mt-1">Organize and manage your digital assets</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard/content-types/create">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-zinc-800 active:scale-95 shadow-lg shadow-zinc-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Type
            </button>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content Types (Bento Grid) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Content Models</h2>
            <Link
              href="/admin/dashboard/content-types"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {contentTypes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 p-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-50 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">No content models</h3>
              <p className="text-zinc-500 text-sm mt-1 mb-6">
                Create your first content type to start.
              </p>
              <Link href="/admin/dashboard/content-types/create">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
                >
                  Create Model
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contentTypes.slice(0, 6).map((type) => (
                <div
                  key={type.id}
                  className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                      <Database className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Link
                        href={`/admin/dashboard/content-types/${type.apiIdentifier}/edit`}
                        className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 mb-1">{type.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono mb-4">{type.apiIdentifier}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50">
                    <span className="text-xs font-medium text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md">
                      {type._count.entries} entries
                    </span>
                    <Link
                      href={`/admin/dashboard/content-types/${type.apiIdentifier}/content`}
                      className="text-xs font-semibold text-zinc-900 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Manage <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity & Templates */}
        <div className="space-y-8">
          {/* Recent Entries */}
          <div className="rounded-3xl bg-white p-6 border border-zinc-100 shadow-xl shadow-zinc-200/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900">Recent Entries</h2>
            </div>
            <div className="space-y-4">
              {allContentEntries.length > 0 ? (
                allContentEntries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 group cursor-pointer hover:bg-zinc-50 p-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-zinc-900 truncate">
                        {entry.contentType?.name || 'Untitled Entry'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/admin/dashboard/content-types/${entry.contentType?.apiIdentifier}/content`}
                      className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-zinc-900 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-400 text-center py-4">No recent entries found.</p>
              )}
            </div>
          </div>

          {/* Templates Widget */}
          <div className="rounded-3xl bg-zinc-900 p-6 text-white shadow-xl shadow-zinc-900/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                  <Layout className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Templates</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-6">
                Start with a pre-built structure for your content.
              </p>
              <Link href="/admin/dashboard/templates">
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors"
                >
                  Browse Templates
                </button>
              </Link>
            </div>
            {/* Decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 -mr-12 h-32 w-32 rounded-full bg-purple-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  )
}
