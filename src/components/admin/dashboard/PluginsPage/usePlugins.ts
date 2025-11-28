'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Plugin } from '@/lib/plugins/config'
import {
  getAllPlugins,
  togglePlugin as togglePluginService,
  updatePluginConfig,
} from '@/lib/plugins/service'

import { availablePlugins } from './data'

export function usePlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(availablePlugins)
  const [isLoading, setIsLoading] = useState(true)
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

      // Also check S3 status specifically
      try {
        const s3Response = await fetch('/api/plugins/s3')
        const s3Data = await s3Response.json()

        setPlugins(
          pluginData.map((p) => {
            let enabled = persisted[p.id] ?? p.enabled

            if (p.id === 's3') {
              const s3Enabled = !!(s3Data.success && s3Data.config)
              enabled = s3Enabled
              return {
                ...p,
                enabled,
                installDate: s3Enabled ? new Date().toISOString().split('T')[0] : undefined,
              }
            }

            return { ...p, enabled }
          }),
        )
      } catch (_error) {
        // Fallback if S3 check fails
        setPlugins(pluginData.map((p) => ({ ...p, enabled: persisted[p.id] ?? p.enabled })))
      }
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

  // Initial load
  useEffect(() => {
    loadPlugins()
  }, [loadPlugins])

  const togglePlugin = useCallback(
    async (pluginId: string) => {
      try {
        const newState = await togglePluginService(pluginId)

        // Persist state locally
        const persisted = JSON.parse(localStorage.getItem('nova-plugin-states') || '{}') as Record<
          string,
          boolean
        >
        persisted[pluginId] = newState
        localStorage.setItem('nova-plugin-states', JSON.stringify(persisted))

        // Update local state
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

  const savePluginConfig = async (plugin: Plugin, config: Record<string, any>) => {
    try {
      // For S3, save directly to the API
      if (plugin.id === 's3-storage' || plugin.id === 's3') {
        const response = await fetch('/api/plugins/s3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        })

        const text = await response.text()
        if (!response.ok) {
          try {
            const data = JSON.parse(text)
            const msg = data?.error || data?.message || 'Failed to save S3 configuration'
            throw new Error(msg)
          } catch {
            throw new Error('Failed to save S3 configuration')
          }
        }
      } else {
        // For other plugins, use the generic service
        await updatePluginConfig(plugin.id, config)
      }

      // Notify app for real-time updates
      try {
        const evt = new CustomEvent('nova-plugin-config-changed', {
          detail: { id: plugin.id, config },
        })
        window.dispatchEvent(evt)

        // Force update navbar from localStorage
        try {
          const key = 'nova-plugin-configs'
          const current = JSON.parse(localStorage.getItem(key) || '{}')
          localStorage.setItem(
            key,
            JSON.stringify({
              ...current,
              [plugin.id]: { ...(current?.[plugin.id] || {}), ...config },
            }),
          )
        } catch {}
      } catch {}

      await loadPlugins() // Reload to get updated config

      toast({
        title: 'Configuration saved',
        description: `Configuration for ${plugin.name} saved successfully`,
      })
    } catch (error) {
      console.error('Error saving plugin config:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not save configuration',
        variant: 'destructive',
      })
      throw error // Re-throw to let the modal know
    }
  }

  // Listen for global toggle events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail
      if (detail?.id) togglePlugin(detail.id)
    }
    window.addEventListener('nova-toggle-plugin', handler as EventListener)
    return () => window.removeEventListener('nova-toggle-plugin', handler as EventListener)
  }, [togglePlugin])

  return {
    plugins,
    isLoading,
    togglePlugin,
    savePluginConfig,
    refreshPlugins: loadPlugins,
  }
}
