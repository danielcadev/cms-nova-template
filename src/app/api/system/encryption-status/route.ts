import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const key = process.env.ENCRYPTION_KEY || ''
    const isHex64 = /^[0-9a-fA-F]{64}$/.test(key)
    if (!key) {
      return NextResponse.json({ ok: false, reason: 'missing' })
    }
    if (!isHex64) {
      return NextResponse.json({ ok: false, reason: 'invalid', length: key.length })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, reason: 'error' }, { status: 200 })
  }
}