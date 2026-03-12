import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'
import { isPublicTypePathsEnabled } from '@/server/plugins/public-typepaths'

export async function GET() {
  try {
    const session = await getAdminSession()
    const publicTypePathsEnabled = await isPublicTypePathsEnabled()

    if (!session && !publicTypePathsEnabled) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch minimal fields needed for dynamic nav
    const types = await prisma.contentType.findMany({
      select: { id: true, apiIdentifier: true, name: true },
      orderBy: { createdAt: 'asc' },
    })

    const contentTypes = types.map((t) => ({
      id: t.id,
      apiIdentifier: t.apiIdentifier,
      name: t.name,
    }))

    return NextResponse.json({ success: true, data: { contentTypes } })
  } catch (e) {
    logger.error('GET /api/content-types error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
