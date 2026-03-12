import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const slug = url.pathname.split('/').pop() || ''

    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: {
          orderBy: { label: 'asc' },
        },
        _count: {
          select: {
            entries: true,
          },
        },
      },
    })

    if (!contentType) {
      return NextResponse.json({ error: 'Content type not found' }, { status: 404 })
    }

    return NextResponse.json(contentType)
  } catch (error) {
    logger.error('Error fetching content type', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
