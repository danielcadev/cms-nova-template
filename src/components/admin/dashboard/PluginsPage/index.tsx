'use client'

import { useState } from 'react'
import type { Plugin } from '@/lib/plugins/config'
import { PluginConfigModal } from './PluginConfigModal'
import { PluginsPageContent } from './PluginsPageContent'
import { usePlugins } from './usePlugins'

export default function PluginsPage() {
  const { plugins, isLoading, togglePlugin, refreshPlugins, savePluginConfig } = usePlugins()
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const handleConfigurePlugin = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    setIsConfigModalOpen(true)
  }

  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!selectedPlugin) return
    await savePluginConfig(selectedPlugin, config)
  }

  return (
    <>
      <PluginsPageContent
        plugins={plugins}
        isLoading={isLoading}
        handleTogglePlugin={togglePlugin}
        handleRefresh={refreshPlugins}
        onConfigurePlugin={handleConfigurePlugin}
      />

      <PluginConfigModal
        plugin={selectedPlugin}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false)
          setSelectedPlugin(null)
        }}
        onSave={handleSaveConfig}
      />
    </>
  )
}

export { PluginsPageContent }
