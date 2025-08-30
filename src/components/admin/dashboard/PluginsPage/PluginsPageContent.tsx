'use client'

import {
  CheckCircle,
  Filter,
  Grid3X3,
  List,
  Puzzle,
  RefreshCw,
  Search,
  Settings,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ThemedButton } from '@/components/ui/ThemedButton'
import type { Plugin } from '@/lib/plugins/config'
import { AdminLoading } from '../AdminLoading'

interface PluginsPageContentProps {
  plugins: Plugin[]
  isLoading: boolean
  handleTogglePlugin: (pluginId: string) => void
  handleRefresh: () => void
  onConfigurePlugin?: (plugin: Plugin) => void
}

type ViewMode = 'list' | 'grid'
type FilterStatus = 'all' | 'enabled' | 'disabled'

export function PluginsPageContent({
  plugins,
  isLoading,
  handleTogglePlugin,
  handleRefresh,
  onConfigurePlugin,
}: PluginsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [refreshing, setRefreshing] = useState(false)

  // Filtered plugins
  const filteredPlugins = useMemo(() => {
    let filtered = plugins

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(query) ||
          plugin.description.toLowerCase().includes(query) ||
          plugin.author.toLowerCase().includes(query),
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((plugin) =>
        filterStatus === 'enabled' ? plugin.enabled : !plugin.enabled,
      )
    }

    return filtered
  }, [plugins, searchQuery, filterStatus])

  const handleRefreshClick = async () => {
    setRefreshing(true)
    await handleRefresh()
    setTimeout(() => setRefreshing(false), 500)
  }

  if (isLoading)
    return (
      <div className="relative">
        <AdminLoading
          title="Plugins"
          message="Loading available plugins..."
          variant="content"
          fullScreen
        />
      </div>
    )

  const enabledCount = plugins.filter((p) => p.enabled).length
  const totalCount = plugins.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Cover Header (keep as is) */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div>
              <p className="text-sm theme-text-muted mb-2">System</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Plugins
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Extend your CMS capabilities with specialized plugins and integrations.
              </p>
            </div>
            <ThemedButton onClick={handleRefreshClick} disabled={refreshing} className="shrink-0">
              <RefreshCw
                className={`h-4 w-4 mr-2 theme-text ${refreshing ? 'animate-spin' : ''}`}
                strokeWidth={1.5}
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </ThemedButton>
          </div>
        </div>

        {/* Controls */}
        {plugins.length > 0 && (
          <div className="rounded-xl border theme-border theme-card p-4 md:p-5 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search + Filters */}
              <div className="flex-1 flex flex-col gap-3 md:flex-row md:items-center">
                {/* Search */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 theme-text-muted" />
                  <Input
                    placeholder="Search plugins by name, description, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 theme-card theme-text border theme-border"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 theme-text-muted" />
                  <div className="flex rounded-lg border theme-border overflow-hidden">
                    {(['all', 'enabled', 'disabled'] as FilterStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          filterStatus === status
                            ? 'theme-card-hover theme-text'
                            : 'theme-card theme-text-secondary hover:theme-text'
                        }`}
                      >
                        {status === 'all' ? 'All' : status === 'enabled' ? 'Enabled' : 'Disabled'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* View mode */}
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

            {/* Results summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm theme-text-muted border-t theme-border pt-3">
              <div className="flex items-center gap-2">
                <span>
                  Showing {filteredPlugins.length} of {plugins.length}
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                  {filterStatus !== 'all' ? ` • ${filterStatus} only` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {enabledCount} enabled
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {totalCount - enabledCount} disabled
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {filteredPlugins.length === 0 && plugins.length === 0 ? (
          <div className="rounded-xl border theme-border theme-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg theme-bg-secondary flex items-center justify-center">
              <Puzzle className="w-8 h-8 theme-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold theme-text mb-2">No plugins available</h3>
            <p className="theme-text-secondary mb-6 max-w-md mx-auto">
              Plugins let you extend your CMS functionality with additional features and
              integrations.
            </p>
          </div>
        ) : filteredPlugins.length === 0 ? (
          <div className="rounded-xl border theme-border theme-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg theme-bg-secondary flex items-center justify-center">
              <Search className="w-8 h-8 theme-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold theme-text mb-2">No plugins found</h3>
            <p className="theme-text-secondary mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No plugins match "${searchQuery}". Try adjusting your search or filters.`
                : `No ${filterStatus} plugins found. Try changing your filter.`}
            </p>
            <div className="flex gap-3 justify-center">
              {searchQuery && (
                <ThemedButton variantTone="ghost" onClick={() => setSearchQuery('')}>
                  Clear search
                </ThemedButton>
              )}
              {filterStatus !== 'all' && (
                <ThemedButton variantTone="ghost" onClick={() => setFilterStatus('all')}>
                  Show all plugins
                </ThemedButton>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* List view */}
            {viewMode === 'list' && (
              <div className="divide-y theme-border rounded-xl border theme-border overflow-hidden theme-card">
                {filteredPlugins.map((plugin) => (
                  <div key={plugin.id} className="group">
                    <div className="flex items-center justify-between p-4 md:p-5 hover:theme-card-hover transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-lg theme-bg-secondary flex items-center justify-center shrink-0 text-2xl">
                          {plugin.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="text-sm font-medium theme-text truncate">
                              {plugin.name}
                            </div>
                            <div
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                plugin.enabled
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                            >
                              {plugin.enabled ? 'Enabled' : 'Disabled'}
                            </div>
                          </div>
                          <div className="text-xs theme-text-muted mb-2">
                            v{plugin.version} • {plugin.author}
                          </div>
                          <div className="text-xs theme-text-secondary line-clamp-2">
                            {plugin.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        {plugin.configurable && (
                          <ThemedButton
                            variantTone="ghost"
                            onClick={() => onConfigurePlugin?.(plugin)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs theme-text hover:theme-text-secondary"
                          >
                            <Settings className="h-3 w-3 mr-1 theme-text" />
                            Configure
                          </ThemedButton>
                        )}
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={plugin.enabled}
                            onCheckedChange={() => handleTogglePlugin(plugin.id)}
                            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid view */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="group rounded-xl border theme-border theme-card p-6 hover:shadow-lg hover:theme-card-hover transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-14 w-14 rounded-lg theme-bg-secondary flex items-center justify-center shrink-0 text-3xl">
                        {plugin.icon}
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          plugin.enabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {plugin.enabled ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Enabled
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" /> Disabled
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="text-base font-medium theme-text">{plugin.name}</div>
                      <div className="text-xs theme-text-muted">
                        v{plugin.version} • {plugin.author}
                      </div>
                    </div>

                    <p className="text-sm theme-text-secondary line-clamp-3 mb-5">
                      {plugin.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t theme-border">
                      {plugin.configurable ? (
                        <ThemedButton
                          variantTone="ghost"
                          onClick={() => onConfigurePlugin?.(plugin)}
                          className="px-3 py-1.5 text-xs theme-text hover:theme-text-secondary"
                        >
                          <Settings className="h-3 w-3 mr-1 theme-text" /> Configure
                        </ThemedButton>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-md theme-bg-secondary theme-text-secondary">
                          Not configurable
                        </span>
                      )}

                      <Switch
                        checked={plugin.enabled}
                        onCheckedChange={() => handleTogglePlugin(plugin.id)}
                        className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
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
