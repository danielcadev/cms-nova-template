import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    // Hide existence and details from unauthenticated users
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const rl = rateLimit(request, { limit: 30, windowMs: 60_000, key: 'system:enc-status' })
  if (!rl.allowed) return NextResponse.json({ ok: false }, { status: 429 })

  try {
    const key = process.env.ENCRYPTION_KEY || ''
    const isHex64 = /^[0-9a-fA-F]{64}$/.test(key)
    return new NextResponse(JSON.stringify({ ok: isHex64 }), {
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
