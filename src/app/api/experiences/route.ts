import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const experiences = await (prisma as any).experience.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, experiences })
  } catch (error) {
    console.error('GET /api/experiences error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to load experiences.' },
      { status: 500 },
    )
  }
}
