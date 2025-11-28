'use client'

import { Puzzle, RefreshCw, Search, Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { Plugin } from '@/lib/plugins/config'
import { AdminLoading } from '../AdminLoading'

interface PluginsPageContentProps {
  plugins: Plugin[]
  isLoading: boolean
  handleTogglePlugin: (pluginId: string) => void
  handleRefresh: () => void
  onConfigurePlugin?: (plugin: Plugin) => void
}

type FilterStatus = 'all' | 'enabled' | 'disabled'

export function PluginsPageContent({
  plugins,
  isLoading,
  handleTogglePlugin,
  handleRefresh,
  onConfigurePlugin,
}: PluginsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
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

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Plugins</h1>
            <p className="text-zinc-500 mt-1">Extend your CMS capabilities.</p>
          </div>
          <Button
            onClick={handleRefreshClick}
            disabled={refreshing}
            variant="outline"
            className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Controls */}
        {plugins.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-zinc-200 bg-white h-11 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200 w-fit">
              {(['all', 'enabled', 'disabled'] as FilterStatus[]).map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterStatus === status
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'enabled' ? 'Enabled' : 'Disabled'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {filteredPlugins.length === 0 && plugins.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
              <Puzzle className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No plugins available</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Plugins let you extend your CMS functionality with additional features and
              integrations.
            </p>
          </div>
        ) : filteredPlugins.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
              <Search className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No plugins found</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
              {searchQuery
                ? `No plugins match "${searchQuery}".`
                : `No ${filterStatus} plugins found.`}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
              }}
              className="rounded-xl border-zinc-200"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="group relative flex flex-col bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-900/5 hover:border-zinc-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-zinc-100 transition-all duration-300">
                    {plugin.icon}
                  </div>
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      plugin.enabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                    }`}
                  >
                    {plugin.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 h-10">{plugin.description}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {plugin.configurable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onConfigurePlugin?.(plugin)}
                        className="h-8 px-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                      >
                        <Settings className="h-4 w-4 mr-1.5" />
                        Configure
                      </Button>
                    ) : (
                      <span className="text-xs text-zinc-400 px-2">Not configurable</span>
                    )}
                  </div>

                  <Switch
                    checked={plugin.enabled}
                    onCheckedChange={() => handleTogglePlugin(plugin.id)}
                    className="data-[state=checked]:bg-zinc-900 data-[state=unchecked]:bg-zinc-200"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
