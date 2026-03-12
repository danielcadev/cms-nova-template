import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AVAILABLE_PLUGINS } from '@/modules/plugins/config'
import logger from '@/server/observability/logger'

const PLUGIN_ID = 'dynamic-nav'
const PLUGIN_STORE_PREFIX = 'plugin:'

function storeKey(pluginId: string) {
  return `${PLUGIN_STORE_PREFIX}${pluginId}`
}

async function readDynamicNavRecord(): Promise<{ enabled: boolean; config: Record<string, any> }> {
  const plugin = AVAILABLE_PLUGINS.find((p) => p.id === PLUGIN_ID)
  const defaults = (plugin?.settings || {}) as Record<string, any>
  const fallbackEnabled = plugin?.enabled ?? false

  try {
    const row = await prisma.novaConfig.findUnique({ where: { key: storeKey(PLUGIN_ID) } })
    const raw = row?.value
    if (!raw || typeof raw !== 'object') {
      return { enabled: fallbackEnabled, config: defaults }
    }

    const enabled =
      typeof (raw as any).enabled === 'boolean'
        ? ((raw as any).enabled as boolean)
        : fallbackEnabled
    const config =
      (raw as any).config && typeof (raw as any).config === 'object'
        ? ({ ...defaults, ...((raw as any).config as Record<string, any>) } as Record<string, any>)
        : defaults

    return { enabled, config }
  } catch (e) {
    logger.error('dynamic-nav: failed to read config', e)
    return { enabled: fallbackEnabled, config: defaults }
  }
}

function sanitizePublicDynamicNavConfig(config: Record<string, any>) {
  return {
    mode: config?.mode === 'include' ? 'include' : 'auto',
    include: Array.isArray(config?.include) ? config.include : [],
    exclude: Array.isArray(config?.exclude) ? config.exclude : [],
    titleCase: typeof config?.titleCase === 'boolean' ? config.titleCase : true,
    templates: config?.templates && typeof config.templates === 'object' ? config.templates : {},
  }
}

export async function GET() {
  const { enabled, config } = await readDynamicNavRecord()
  return NextResponse.json({
    success: true,
    enabled,
    config: sanitizePublicDynamicNavConfig(config),
  })
}
