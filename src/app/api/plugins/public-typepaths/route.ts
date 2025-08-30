import { NextResponse } from 'next/server'
import { getAllPlugins } from '@/lib/plugins/service'

// Returns success: true if the plugin 'public-typepaths' is enabled
export async function GET() {
  try {
    const plugins = await getAllPlugins()
    const found = plugins.find((p) => p.id === 'public-typepaths')
    const enabled = !!found?.enabled
    return NextResponse.json({ success: enabled })
  } catch (_e) {
    // On error, be conservative and return disabled
    return NextResponse.json({ success: false })
  }
}
