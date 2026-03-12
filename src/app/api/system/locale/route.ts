import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { locale?: unknown }
  const locale = body?.locale

  if (locale !== 'en' && locale !== 'es') {
    return NextResponse.json({ success: false, error: 'Invalid locale' }, { status: 400 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return res
}
