import { prisma } from '@/lib/prisma'
import { AVAILABLE_PLUGINS, type Plugin } from './config'

const PLUGIN_STORE_PREFIX = 'plugin:'

function storeKey(pluginId: string) {
  return `${PLUGIN_STORE_PREFIX}${pluginId}`
}

function looksEncryptedString(value: string) {
  const parts = value.split(':')
  if (parts.length !== 3) return false
  const [iv, tag, data] = parts
  const isHex = (s: string) => /^[0-9a-fA-F]+$/.test(s)
  return (
    isHex(iv) &&
    iv.length === 32 &&
    isHex(tag) &&
    tag.length === 32 &&
    isHex(data) &&
    data.length >= 2
  )
}

export async function getPluginSettings(id: string): Promise<{
  enabled: boolean
  config: Record<string, any>
  plugin: Plugin | undefined
}> {
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === id)

  const defaults = (plugin?.settings || {}) as Record<string, any>

  try {
    const stored = await prisma.novaConfig.findUnique({ where: { key: storeKey(id) } })
    const raw = stored?.value
    const enabled =
      raw && typeof raw === 'object' && raw !== null && typeof (raw as any).enabled === 'boolean'
        ? ((raw as any).enabled as boolean)
        : (plugin?.enabled ?? false)

    const configRaw =
      raw &&
      typeof raw === 'object' &&
      raw !== null &&
      (raw as any).config &&
      typeof (raw as any).config === 'object'
        ? ((raw as any).config as Record<string, any>)
        : {}

    let config = { ...defaults, ...configRaw }

    const encryptionKey = process.env.ENCRYPTION_KEY || ''
    const isHex64 = /^[0-9a-fA-F]{64}$/.test(encryptionKey)

    if (isHex64 && config && typeof config === 'object') {
      const { decrypt } = await import('@/lib/encryption')
      const decryptedConfig: Record<string, any> = { ...config }
      for (const [k, v] of Object.entries(decryptedConfig)) {
        if (typeof v === 'string' && looksEncryptedString(v)) {
          decryptedConfig[k] = decrypt(v)
        }
      }
      config = decryptedConfig
    }

    return { enabled, config, plugin }
  } catch {
    return { enabled: plugin?.enabled || false, config: defaults, plugin }
  }
}
