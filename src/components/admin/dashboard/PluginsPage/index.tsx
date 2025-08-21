'use client'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Plugin } from '@/lib/plugins/config'
import { getAllPlugins, togglePlugin, updatePluginConfig } from '@/lib/plugins/service'
import { PluginsPageContent } from './PluginsPageContent'
import { S3ConfigModal } from './S3ConfigModal'

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const { toast } = useToast()

  const loadPlugins = useCallback(async () => {
    try {
      setIsLoading(true)
      const pluginData = await getAllPlugins()
      setPlugins(pluginData)
    } catch (error) {
      console.error('Error loading plugins:', error)
      toast({
        title: 'Error',
        description: 'Could not load plugins',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Cargar plugins al montar el componente
  useEffect(() => {
    loadPlugins()
  }, [loadPlugins])

  const handleTogglePlugin = async (pluginId: string) => {
    try {
      const newState = await togglePlugin(pluginId)

      // Actualizar el estado local
      setPlugins((prev) =>
        prev.map((plugin) => (plugin.id === pluginId ? { ...plugin, enabled: newState } : plugin)),
      )

      const plugin = plugins.find((p) => p.id === pluginId)
      toast({
        title: newState ? 'Plugin enabled' : 'Plugin disabled',
        description: `${plugin?.name} has been ${newState ? 'enabled' : 'disabled'} successfully`,
      })
    } catch (error) {
      console.error('Error toggling plugin:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not change plugin state',
        variant: 'destructive',
      })
    }
  }

  const handleRefresh = async () => {
    await loadPlugins()
    toast({
      title: 'Plugins refreshed',
      description: 'Plugins list updated successfully',
    })
  }

  const handleConfigurePlugin = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    setIsConfigModalOpen(true)
  }

  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!selectedPlugin) return

    try {
      // Para S3, guardar directamente en la API
      if (selectedPlugin.id === 's3-storage' || selectedPlugin.id === 's3') {
        const response = await fetch('/api/plugins/s3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        })

        if (!response.ok) {
          throw new Error('Failed to save S3 configuration')
        }

        // Configuration saved successfully; keep UI feedback via toast only
        const _result = await response.json()
      } else {
        // Para otros plugins, usar el servicio
        await updatePluginConfig(selectedPlugin.id, config)
      }

      await loadPlugins() // Recargar para obtener la configuración actualizada

      toast({
        title: 'Configuration saved',
        description: `Configuration for ${selectedPlugin.name} saved successfully`,
      })
    } catch (error) {
      console.error('Error saving plugin config:', error)
      toast({
        title: 'Error',
        description: 'Could not save configuration',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <PluginsPageContent
        plugins={plugins}
        isLoading={isLoading}
        handleTogglePlugin={handleTogglePlugin}
        handleRefresh={handleRefresh}
        onConfigurePlugin={handleConfigurePlugin}
      />

      {selectedPlugin && (
        <S3ConfigModal
          plugin={selectedPlugin}
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false)
            setSelectedPlugin(null)
          }}
          onSave={handleSaveConfig}
        />
      )}
    </>
  )
}

export { PluginsPageContent }
