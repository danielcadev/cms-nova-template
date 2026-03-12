import { NextResponse } from 'next/server'
import { isPublicTypePathsEnabled } from '@/server/plugins/public-typepaths'

export async function GET() {
  try {
    const enabled = await isPublicTypePathsEnabled()
    return NextResponse.json({ success: true, enabled })
  } catch (_e) {
    return NextResponse.json({ success: false, enabled: false })
  }
}
