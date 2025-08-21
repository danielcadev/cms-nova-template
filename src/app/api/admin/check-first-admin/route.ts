// api/admin/check-first-admin/route.ts - Check if an admin already exists
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import logger from '@/utils/logger'

export async function GET(request: Request) {
  try {
    const rl = rateLimit(request, {
      limit: 30,
      windowMs: 60_000,
      key: 'admin:check-first-admin:GET',
    })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const userCount = await prisma.user.count()
    return NextResponse.json({ hasAdmin: userCount > 0, userCount })
  } catch (error) {
    logger.error('Error checking admin:', error)
    return NextResponse.json({ hasAdmin: false, userCount: 0, error: 'Database not configured' })
  }
}
