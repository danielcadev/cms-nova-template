import { AVAILABLE_PLUGINS, type Plugin } from '@/modules/plugins/config'

export async function getAllPlugins(): Promise<Plugin[]> {
  const plugins = await Promise.all(
    AVAILABLE_PLUGINS.map(async (plugin) => {
      let settings = plugin.settings
      let enabled = plugin.enabled

      try {
        const res = await fetch(`/api/plugins/${plugin.id}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data?.success) {
            if (typeof data.enabled === 'boolean') enabled = data.enabled
            if (data.config) settings = { ...settings, ...data.config }
          }
        }
      } catch {}

      if (plugin.id === 's3-storage') {
        try {
          const response = await fetch('/api/plugins/s3', { cache: 'no-store' })
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.config) {
              settings = { ...settings, ...data.config }
            }
          }
        } catch (_error) {
          // Ignore S3 config load errors; UI will surface configuration state separately.
        }
      }

      return {
        ...plugin,
        enabled,
        settings,
      }
    }),
  )

  return plugins
}

export async function togglePlugin(pluginId: string): Promise<boolean> {
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === pluginId)
  if (!plugin) {
    throw new Error(`Plugin ${pluginId} not found`)
  }

  // Get current enabled state from the server store (authoritative)
  let currentEnabled = plugin.enabled
  try {
    const currentRes = await fetch(`/api/plugins/${pluginId}`, { cache: 'no-store' })
    if (currentRes.ok) {
      const current = await currentRes.json()
      if (current?.success && typeof current.enabled === 'boolean') currentEnabled = current.enabled
    }
  } catch {}

  const nextEnabled = !currentEnabled

  // Prevent disabling plugins that are still depended-on.
  if (currentEnabled && !nextEnabled) {
    const dependents = AVAILABLE_PLUGINS.filter((p) => p.dependencies?.includes(pluginId))
    if (dependents.length > 0) {
      const all = await getAllPlugins()
      const enabledDependents = dependents.filter((p) => all.find((x) => x.id === p.id)?.enabled)
      if (enabledDependents.length > 0) {
        throw new Error(
          `Cannot disable ${plugin.name}. The following plugins depend on it: ${enabledDependents.map((p) => p.name).join(', ')}`,
        )
      }
    }
  }

  const res = await fetch(`/api/plugins/${pluginId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled: nextEnabled }),
  })

  if (!res.ok) {
    throw new Error(`Failed to update ${plugin.name}`)
  }

  const data = await res.json().catch(() => null)
  if (data?.success && typeof data.enabled === 'boolean') return data.enabled
  return nextEnabled
}

export function getPluginConfig(pluginId: string): Record<string, any> | undefined {
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === pluginId)
  return plugin?.settings
}

export async function updatePluginConfig(
  pluginId: string,
  config: Record<string, any>,
): Promise<void> {
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === pluginId)
  if (!plugin) {
    throw new Error(`Plugin ${pluginId} not found`)
  }

  if (!plugin.configurable) {
    throw new Error(`Plugin ${plugin.name} is not configurable`)
  }

  const res = await fetch(`/api/plugins/${pluginId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })

  if (!res.ok) {
    throw new Error(`Failed to update config for ${plugin.name}`)
  }
}
