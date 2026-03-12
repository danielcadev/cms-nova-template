import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AVAILABLE_PLUGINS } from '@/modules/plugins/config'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

const PLUGIN_STORE_PREFIX = 'plugin:'

function storeKey(pluginId: string) {
  return `${PLUGIN_STORE_PREFIX}${pluginId}`
}

function isSensitiveKey(key: string) {
  const k = key.toLowerCase()
  return ['key', 'secret', 'token', 'password', 'authorization', 'cookie', 'apikey'].some(
    (needle) => k.includes(needle),
  )
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

function sanitizeConfigForClient(config: Record<string, any>) {
  const safeConfig: Record<string, any> = {}

  for (const [key, value] of Object.entries(config || {})) {
    if (typeof value === 'string' && value) {
      safeConfig[key] = isSensitiveKey(key) || looksEncryptedString(value) ? '••••••••' : value
    } else {
      safeConfig[key] = value
    }
  }

  return safeConfig
}

async function readPluginRecord(
  pluginId: string,
): Promise<{ enabled?: boolean; config?: Record<string, any> }> {
  try {
    const row = await prisma.novaConfig.findUnique({ where: { key: storeKey(pluginId) } })
    const raw = row?.value
    if (!raw || typeof raw !== 'object') return {}
    const obj = raw as any
    return {
      enabled: typeof obj.enabled === 'boolean' ? obj.enabled : undefined,
      config:
        obj.config && typeof obj.config === 'object'
          ? (obj.config as Record<string, any>)
          : undefined,
    }
  } catch (e) {
    logger.error('plugins: failed reading NovaConfig', { pluginId, error: e })
    return {}
  }
}

async function writePluginRecord(
  pluginId: string,
  data: { enabled: boolean; config: Record<string, any> },
) {
  await prisma.novaConfig.upsert({
    where: { key: storeKey(pluginId) },
    update: { value: data, category: 'plugin' },
    create: { key: storeKey(pluginId), value: data, category: 'plugin' },
  })
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() || ''
  try {
    const stored = await readPluginRecord(id)
    const plugin = AVAILABLE_PLUGINS.find((p) => p.id === id)
    if (!plugin) {
      return NextResponse.json({ success: false, error: 'Plugin not found' }, { status: 404 })
    }

    const mergedConfig = { ...(plugin.settings ?? {}), ...(stored.config ?? {}) }
    const config = sanitizeConfigForClient(mergedConfig)
    const enabled = stored.enabled ?? plugin.enabled ?? false

    return NextResponse.json({ success: true, enabled, config })
  } catch (e) {
    logger.error('GET /api/plugins/[id] error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() || ''
  try {
    const incoming = (await req.json()) as Record<string, any>

    const plugin = AVAILABLE_PLUGINS.find((p) => p.id === id)
    if (!plugin) {
      return NextResponse.json({ success: false, error: 'Plugin not found' }, { status: 404 })
    }

    const stored = await readPluginRecord(id)
    const currentEnabled = stored.enabled ?? plugin.enabled ?? false
    const currentConfig = { ...(plugin.settings ?? {}), ...(stored.config ?? {}) }

    // If payload contains only 'enabled' (or includes it), update states
    if (Object.hasOwn(incoming, 'enabled')) {
      // handled below
    }

    // If there are other keys besides enabled, treat them as config updates
    const { enabled: _omit, ...configPatch } = incoming
    if (Object.keys(configPatch).length > 0) {
      // Handle sensitive fields (encrypt at rest)
      const hasSensitive = Object.keys(configPatch).some((key) => isSensitiveKey(key))
      if (hasSensitive) {
        const encryptionKey = process.env.ENCRYPTION_KEY || ''
        const isHex64 = /^[0-9a-fA-F]{64}$/.test(encryptionKey)
        if (!isHex64) {
          return NextResponse.json(
            {
              success: false,
              error: 'Encryption key not configured. Set ENCRYPTION_KEY (64 hex chars).',
            },
            { status: 400 },
          )
        }

        const { encrypt } = await import('@/lib/encryption')
        for (const [k, v] of Object.entries(configPatch)) {
          if (!isSensitiveKey(k)) continue
          if (typeof v === 'string' && v.includes('••••')) {
            delete configPatch[k]
            continue
          }
          if (v === '') {
            configPatch[k] = ''
            continue
          }
          if (typeof v === 'string' && v.trim()) {
            configPatch[k] = encrypt(v)
            continue
          }
          // Ignore invalid shapes
          delete configPatch[k]
        }
      }
    }

    const nextEnabled = Object.hasOwn(incoming, 'enabled') ? !!incoming.enabled : currentEnabled
    const nextConfig =
      Object.keys(configPatch).length > 0 ? { ...currentConfig, ...configPatch } : currentConfig

    await writePluginRecord(id, { enabled: nextEnabled, config: nextConfig })

    return NextResponse.json({
      success: true,
      enabled: nextEnabled,
      config: sanitizeConfigForClient(nextConfig),
    })
  } catch (e) {
    logger.error('POST /api/plugins/[id] error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
