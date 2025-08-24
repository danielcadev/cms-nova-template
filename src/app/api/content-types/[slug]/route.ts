import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

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
    console.error('Error fetching content type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
