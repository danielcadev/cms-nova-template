import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type NextRequest, NextResponse } from 'next/server'
import { AVAILABLE_PLUGINS } from '@/lib/plugins/config'

const STORE_DIR = join(process.cwd(), 'src', 'lib', 'plugins')
const STORE_PATH = join(STORE_DIR, 'store.json')

// Store shape persisted on disk
// {
//   configs: { [id: string]: Record<string, any> },
//   states: { [id: string]: boolean }
// }

async function readStore(): Promise<{
  configs: Record<string, any>
  states: Record<string, boolean>
}> {
  try {
    const buf = await readFile(STORE_PATH, 'utf-8')
    const raw = JSON.parse(buf)
    // Backward compatibility with legacy shape { [id]: config }
    const configs: Record<string, any> = raw?.configs || (raw && typeof raw === 'object' ? raw : {})
    const states: Record<string, boolean> = raw?.states || {}
    return { configs, states }
  } catch {
    return { configs: {}, states: {} }
  }
}

async function writeStore(data: { configs: Record<string, any>; states: Record<string, boolean> }) {
  try {
    await mkdir(STORE_DIR, { recursive: true })
  } catch {}
  await writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const store = await readStore()
    const plugin = AVAILABLE_PLUGINS.find((p) => p.id === id)
    if (!plugin) {
      return NextResponse.json({ success: false, error: 'Plugin not found' }, { status: 404 })
    }

    const config = store.configs[id] ?? plugin.settings ?? {}
    const enabled = store.states[id] ?? plugin.enabled ?? false

    return NextResponse.json({ success: true, enabled, config })
  } catch (e) {
    console.error('GET /api/plugins/[id] error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const incoming = (await req.json()) as Record<string, any>
    const store = await readStore()

    // If payload contains only 'enabled' (or includes it), update states
    if (Object.hasOwn(incoming, 'enabled')) {
      const nextEnabled = !!incoming.enabled
      store.states[id] = nextEnabled
    }

    // If there are other keys besides enabled, treat them as config updates
    const { enabled: _omit, ...configPatch } = incoming
    if (Object.keys(configPatch).length > 0) {
      const current = store.configs[id] || {}
      store.configs[id] = { ...current, ...configPatch }
    }

    await writeStore(store)
    const plugin = AVAILABLE_PLUGINS.find((p) => p.id === id)
    const mergedConfig = store.configs[id] ?? plugin?.settings ?? {}
    const enabled = store.states[id] ?? plugin?.enabled ?? false

    return NextResponse.json({ success: true, enabled, config: mergedConfig })
  } catch (e) {
    console.error('POST /api/plugins/[id] error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
