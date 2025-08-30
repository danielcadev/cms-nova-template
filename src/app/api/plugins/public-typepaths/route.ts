import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'
import { AVAILABLE_PLUGINS } from '@/lib/plugins/config'

// Avoid recursion by reading the persisted store directly instead of calling getAllPlugins
export async function GET() {
  try {
    const STORE_PATH = join(process.cwd(), 'src', 'lib', 'plugins', 'store.json')
    let states: Record<string, boolean> = {}
    try {
      const raw = JSON.parse(await readFile(STORE_PATH, 'utf-8')) as {
        states?: Record<string, boolean>
      }
      states = raw.states || {}
    } catch {
      states = {}
    }

    const def = AVAILABLE_PLUGINS.find((p) => p.id === 'public-typepaths')
    const enabled = states['public-typepaths'] ?? def?.enabled ?? false
    return NextResponse.json({ success: true, enabled })
  } catch (_e) {
    return NextResponse.json({ success: false, enabled: false })
  }
}
