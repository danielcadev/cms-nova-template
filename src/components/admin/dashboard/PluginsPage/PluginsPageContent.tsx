'use client'

import { Puzzle, RefreshCw, Search, Settings, Cloud, Compass, Globe, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
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

const GET_ICON = (iconName: string, id: string) => {
  const props = { className: "w-6 h-6" }
  if (id === 's3-storage') return <Cloud {...props} />
  if (id === 'dynamic-nav') return <Compass {...props} />
  if (id === 'public-typepaths') return <Globe {...props} />
  if (id === 'google-gemini') return <Sparkles {...props} />

  // Fallback to name-based if id doesn't match
  switch (iconName) {
    case 'Cloud': return <Cloud {...props} />
    case 'Compass': return <Compass {...props} />
    case 'Globe': return <Globe {...props} />
    case 'Sparkles': return <Sparkles {...props} />
    default: return <Puzzle {...props} />
  }
}

export function PluginsPageContent({
  plugins,
  isLoading,
  handleTogglePlugin,
  handleRefresh,
  onConfigurePlugin,
}: PluginsPageContentProps) {
  const t = useTranslations('plugins')
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
          title={t('title')}
          message={t('loading')}
          variant="content"
          fullScreen
        />
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{t('title')}</h1>
          <p className="text-zinc-500">{t('subtitle')}</p>
        </div>
        <Button
          onClick={handleRefreshClick}
          disabled={refreshing}
          variant="outline"
          className="rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 h-10 px-4 font-semibold shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? t('refreshing') : t('refresh')}
        </Button>
      </div>

      {/* Controls */}
      {plugins.length > 0 && (
        <div className="flex flex-col md:flex-row gap-5">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-zinc-200 bg-white h-10 text-sm focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 w-fit h-10">
            {(['all', 'enabled', 'disabled'] as FilterStatus[]).map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === status
                  ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/50'
                  }`}
              >
                {t(`filters.${status}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {filteredPlugins.length === 0 && plugins.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-zinc-50 rounded-3xl flex items-center justify-center mb-6 border border-zinc-100 shadow-inner">
            <Puzzle className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">{t('empty.noAvailable')}</h3>
          <p className="text-zinc-500 text-base max-w-md mx-auto">
            {t('empty.description')}
          </p>
        </div>
      ) : filteredPlugins.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-zinc-50 rounded-3xl flex items-center justify-center mb-6 border border-zinc-100 shadow-inner">
            <Search className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">{t('empty.noFound')}</h3>
          <p className="text-zinc-500 text-base mb-8 max-w-md mx-auto">
            {searchQuery
              ? t('empty.noMatch', { query: searchQuery })
              : t('empty.noStatus', { status: t(`filters.${filterStatus}`).toLowerCase() })}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setFilterStatus('all')
            }}
            className="rounded-2xl border-zinc-200 h-11 px-6 font-semibold"
          >
            {t('filters.clear')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className="group relative flex flex-col bg-white border border-zinc-200 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-zinc-900/10 hover:border-zinc-900/20 transition-all duration-500 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-zinc-50 rounded-full group-hover:bg-zinc-100/50 transition-colors duration-500" />

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-900/20 group-hover:scale-110 transition-all duration-500">
                  {GET_ICON(plugin.icon, plugin.id)}
                </div>
                <div
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border-2 ${plugin.enabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                    }`}
                >
                  {plugin.enabled ? t('card.enabled') : t('card.disabled')}
                </div>
              </div>

              <div className="mb-8 relative z-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight group-hover:text-zinc-700 transition-colors">
                    {t.has(`list.${plugin.id}.name`) ? t(`list.${plugin.id}.name`) : plugin.name}
                  </h3>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md uppercase">v{plugin.version}</span>
                </div>
                <p className="text-base text-zinc-500 leading-relaxed line-clamp-2 h-12">
                  {t.has(`list.${plugin.id}.description`)
                    ? t(`list.${plugin.id}.description`)
                    : plugin.description}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-zinc-100 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2">
                  {plugin.configurable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfigurePlugin?.(plugin)}
                      className="h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold transition-all active:bg-zinc-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {t('card.configure')}
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-zinc-400 px-4">{t('card.notConfigurable')}</span>
                  )}
                </div>

                <Switch
                  checked={plugin.enabled}
                  onCheckedChange={() => handleTogglePlugin(plugin.id)}
                  className="data-[state=checked]:bg-zinc-900 data-[state=unchecked]:bg-zinc-200 scale-125"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
