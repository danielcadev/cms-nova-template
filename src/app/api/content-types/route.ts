import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
    console.error('GET /api/content-types error', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
