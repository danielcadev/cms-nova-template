'use client'

import { Plus, Puzzle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Plugin } from '@/lib/plugins/config'
import { PluginCard } from './PluginCard'

interface PluginsGridProps {
  plugins: Plugin[]
  onTogglePlugin: (pluginId: string) => void
}

export function PluginsGrid({ plugins, onTogglePlugin }: PluginsGridProps) {
  if (plugins.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm max-w-md mx-auto">
          <Puzzle className="h-12 w-12 text-gray-400 mx-auto mb-6" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            No plugins available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Explore the plugin store to add new features
          </p>
          <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium">
            <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Browse plugins
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plugins.map((plugin) => (
        <PluginCard key={plugin.id} plugin={plugin} onToggle={onTogglePlugin} />
      ))}
    </div>
  )
}
