import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const experiences = await (prisma as any).experience.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, experiences })
  } catch (error) {
    logger.error('GET /api/experiences error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to load experiences.' },
      { status: 500 },
    )
  }
}
