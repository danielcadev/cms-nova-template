import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params
  try {
    const session = await getAdminSession()
    if (!session)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const payload = await request.json().catch(() => ({}))
    const { published } = payload as { published?: boolean }
    if (typeof published !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const experience = await (prisma as any).experience.update({
      where: { id },
      data: { published },
    })
    return NextResponse.json({ success: true, experience })
  } catch (error) {
    logger.error('PATCH /api/experiences/[id] error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to update experience.' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params
  try {
    const session = await getAdminSession()
    if (!session)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await (prisma as any).experience.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('DELETE /api/experiences/[id] error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to delete experience.' },
      { status: 500 },
    )
  }
}
