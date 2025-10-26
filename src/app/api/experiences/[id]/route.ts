import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params

  try {
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
    console.error('PATCH /api/experiences/[id] error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to update experience.' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params

  try {
    await (prisma as any).experience.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/experiences/[id] error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to delete experience.' },
      { status: 500 },
    )
  }
}
