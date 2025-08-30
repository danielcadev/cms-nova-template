import { AVAILABLE_PLUGINS, type Plugin } from './config'

// Simulamos un almacenamiento local para el estado de los plugins
// En una aplicación real, esto podría estar en una base de datos o archivo de configuración
const pluginStates: Record<string, boolean> = (() => {
  if (typeof window === 'undefined') return {}
  try {
    const persisted = JSON.parse(localStorage.getItem('nova-plugin-states') || '{}') as Record<
      string,
      boolean
    >
    return { ...persisted }
  } catch {
    return {}
  }
})()

// Inicializar estados desde la configuración (sin sobrescribir lo persistido)
AVAILABLE_PLUGINS.forEach((plugin) => {
  if (pluginStates[plugin.id] === undefined) {
    pluginStates[plugin.id] = plugin.enabled
  }
})

// Obtener todos los plugins con su estado actual
export async function getAllPlugins(): Promise<Plugin[]> {
  const plugins = await Promise.all(
    AVAILABLE_PLUGINS.map(async (plugin) => {
      let settings = plugin.settings
      let enabled = pluginStates[plugin.id] ?? plugin.enabled

      // Cargar configuración y estado desde API persistente
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

      // Cargar configuración específica de S3 si existe endpoint dedicado
      if (plugin.id === 's3-storage' || plugin.id === 's3') {
        try {
          const response = await fetch('/api/plugins/s3', { cache: 'no-store' })
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.config) {
              settings = { ...settings, ...data.config }
            }
          }
        } catch (error) {
          console.error('Error loading S3 config:', error)
        }
      }

      // Merge con localStorage (fallback demo)
      if (typeof window !== 'undefined') {
        try {
          const all = JSON.parse(localStorage.getItem('nova-plugin-configs') || '{}') as Record<
            string,
            any
          >
          if (all[plugin.id]) settings = { ...settings, ...all[plugin.id] }
        } catch {}
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

// Alternar el estado de un plugin
export async function togglePlugin(pluginId: string): Promise<boolean> {
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === pluginId)
  if (!plugin) {
    throw new Error(`Plugin ${pluginId} not found`)
  }

  // Verificar dependencias antes de desactivar
  if (pluginStates[pluginId] && plugin.dependencies) {
    const dependentPlugins = AVAILABLE_PLUGINS.filter(
      (p) => p.dependencies?.includes(pluginId) && pluginStates[p.id],
    )

    if (dependentPlugins.length > 0) {
      throw new Error(
        `Cannot disable ${plugin.name}. The following plugins depend on it: ${dependentPlugins
          .map((p) => p.name)
          .join(', ')}`,
      )
    }
  }

  // Nuevo estado (toggle)
  const next = !pluginStates[pluginId]

  // Persistir en API
  try {
    const res = await fetch(`/api/plugins/${pluginId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.success && typeof data.enabled === 'boolean') {
        pluginStates[pluginId] = data.enabled
      } else {
        pluginStates[pluginId] = next
      }
    } else {
      pluginStates[pluginId] = next
    }
  } catch {
    pluginStates[pluginId] = next
  }

  // Persistir en localStorage (demo)
  if (typeof window !== 'undefined') {
    try {
      const persisted = JSON.parse(localStorage.getItem('nova-plugin-states') || '{}') as Record<
        string,
        boolean
      >
      persisted[pluginId] = pluginStates[pluginId]
      localStorage.setItem('nova-plugin-states', JSON.stringify(persisted))
    } catch {}
  }

  return pluginStates[pluginId]
}

// Obtener estadísticas de plugins
export async function getPluginStats() {
  const plugins = await getAllPlugins()
  const enabled = plugins.filter((p) => p.enabled).length
  const total = plugins.length

  return {
    total,
    enabled,
    disabled: total - enabled,
    byCategory: {
      security: plugins.filter((p) => p.category === 'security').length,
      analytics: plugins.filter((p) => p.category === 'analytics').length,
      ui: plugins.filter((p) => p.category === 'ui').length,
      integration: plugins.filter((p) => p.category === 'integration').length,
      utility: plugins.filter((p) => p.category === 'utility').length,
    },
  }
}

// Verificar si un plugin está habilitado
export function isPluginEnabled(pluginId: string): boolean {
  return pluginStates[pluginId] ?? false
}

// Obtener configuración de un plugin
export async function getPluginConfigServer(
  pluginId: string,
): Promise<Record<string, any> | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/plugins/${pluginId}`, {
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.success && data?.config) return data.config
    }
  } catch {}
  return undefined
}

export function getPluginConfig(pluginId: string): Record<string, any> | undefined {
  // Intentar leer configuración persistida en cliente
  if (typeof window !== 'undefined') {
    try {
      const all = JSON.parse(localStorage.getItem('nova-plugin-configs') || '{}') as Record<
        string,
        any
      >
      if (all[pluginId]) return all[pluginId]
    } catch {}
  }
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === pluginId)
  return plugin?.settings
}

// Helper: chequear si una plantilla (turismo) está habilitada vía plugin dynamic-nav
export function isTemplateEnabled(name: string): boolean {
  const cfg = getPluginConfig('dynamic-nav') as { templates?: Record<string, boolean> } | undefined
  return !!cfg?.templates?.[name]
}

// Actualizar configuración de un plugin
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

  // Guardar en API persistente (server-side)
  try {
    const res = await fetch(`/api/plugins/${pluginId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (res.ok) {
      const data = await res.json()
      const merged = data?.config
        ? { ...plugin.settings, ...data.config }
        : { ...plugin.settings, ...config }
      plugin.settings = merged

      // Persistir también en localStorage como cache/fallback para UI
      if (typeof window !== 'undefined') {
        try {
          const all = JSON.parse(localStorage.getItem('nova-plugin-configs') || '{}') as Record<
            string,
            any
          >
          all[pluginId] = merged
          localStorage.setItem('nova-plugin-configs', JSON.stringify(all))
        } catch {}
      }
      return
    }
  } catch {}

  // Fallback: si la API falla, al menos actualiza en memoria y localStorage
  plugin.settings = { ...plugin.settings, ...config }
  if (typeof window !== 'undefined') {
    try {
      const all = JSON.parse(localStorage.getItem('nova-plugin-configs') || '{}') as Record<
        string,
        any
      >
      all[pluginId] = plugin.settings
      localStorage.setItem('nova-plugin-configs', JSON.stringify(all))
    } catch {}
  }
}
