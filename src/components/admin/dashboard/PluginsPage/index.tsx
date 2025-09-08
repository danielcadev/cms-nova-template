'use client'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Plugin } from '@/lib/plugins/config'
import { getAllPlugins, togglePlugin, updatePluginConfig } from '@/lib/plugins/service'
import { PluginConfigModal } from './PluginConfigModal'
import { PluginsPageContent } from './PluginsPageContent'

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
      // Merge enabled state with any locally toggled states stored in localStorage
      const persisted = JSON.parse(localStorage.getItem('nova-plugin-states') || '{}') as Record<
        string,
        boolean
      >
      setPlugins(pluginData.map((p) => ({ ...p, enabled: persisted[p.id] ?? p.enabled })))
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

  const handleTogglePlugin = useCallback(
    async (pluginId: string) => {
      try {
        const newState = await togglePlugin(pluginId)

        // Persist state locally to survive reloads (demo storage; replace with DB in prod)
        const persisted = JSON.parse(localStorage.getItem('nova-plugin-states') || '{}') as Record<
          string,
          boolean
        >
        persisted[pluginId] = newState
        localStorage.setItem('nova-plugin-states', JSON.stringify(persisted))

        // Actualizar el estado local
        setPlugins((prev) =>
          prev.map((plugin) =>
            plugin.id === pluginId ? { ...plugin, enabled: newState } : plugin,
          ),
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
    },
    [plugins, toast],
  )

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

  // Allow config modals to toggle plugin via window event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail
      if (detail?.id) handleTogglePlugin(detail.id)
    }
    window.addEventListener('nova-toggle-plugin', handler as EventListener)
    return () => window.removeEventListener('nova-toggle-plugin', handler as EventListener)
  }, [handleTogglePlugin])

  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!selectedPlugin) return

    try {
      // For S3, save directly to the API
      if (selectedPlugin.id === 's3-storage' || selectedPlugin.id === 's3') {
        const response = await fetch('/api/plugins/s3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        })

        const text = await response.text()
        if (!response.ok) {
          // Try to surface backend error
          try {
            const data = JSON.parse(text)
            const msg = data?.error || data?.message || 'Failed to save S3 configuration'
            throw new Error(msg)
          } catch {
            throw new Error('Failed to save S3 configuration')
          }
        }

        // Configuration saved successfully; keep UI feedback via toast only
        const _result = text ? JSON.parse(text) : {}
      } else {
        // For other plugins, use the generic service
        await updatePluginConfig(selectedPlugin.id, config)
      }

      // Notificar a la app para actualizaciones en tiempo real (nav)
      try {
        const evt = new CustomEvent('nova-plugin-config-changed', {
          detail: { id: selectedPlugin.id, config },
        })
        window.dispatchEvent(evt)
        // fuerza re-lectura en navbar desde localStorage
        try {
          const key = 'nova-plugin-configs'
          const current = JSON.parse(localStorage.getItem(key) || '{}')
          localStorage.setItem(
            key,
            JSON.stringify({
              ...current,
              [selectedPlugin.id]: { ...(current?.[selectedPlugin.id] || {}), ...config },
            }),
          )
        } catch {}
      } catch {}

      await loadPlugins() // Recargar para obtener la configuración actualizada

      toast({
        title: 'Configuration saved',
        description: `Configuration for ${selectedPlugin.name} saved successfully`,
      })
    } catch (error) {
      console.error('Error saving plugin config:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not save configuration',
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
