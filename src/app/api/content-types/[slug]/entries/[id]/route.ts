import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    const { slug, id } = await params

    // Find the content type
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: true,
      },
    })

    if (!contentType) {
      return NextResponse.json({ error: 'Content type not found' }, { status: 404 })
    }

    // Get the specific entry
    const entry = await prisma.contentEntry.findFirst({
      where: {
        id,
        contentTypeId: contentType.id,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Content entry not found' }, { status: 404 })
    }

    // Include content type info in response
    const response = {
      ...entry,
      contentType,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching content entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    const { slug, id } = await params
    const body = await request.json()

    // Find the content type with fields (needed to infer title)
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: { fields: true },
    })

    if (!contentType) {
      return NextResponse.json({ error: 'Content type not found' }, { status: 404 })
    }

    // Check if entry exists (by id only to avoid false 404)
    const existingEntry = await prisma.contentEntry.findUnique({ where: { id } })
    if (!existingEntry) {
      return NextResponse.json({ error: 'Content entry not found' }, { status: 404 })
    }

    // Support both shapes: { data, status } and top-level fields
    const hasDataEnvelope = body && typeof body === 'object' && 'data' in body
    const rawData = hasDataEnvelope ? (body.data ?? {}) : (body ?? {})
    const newStatus = hasDataEnvelope ? body.status : body.status

    // Expect slug to live in JSON data
    const entrySlug = rawData?.slug

    // Validate
    if (!entrySlug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Unique slug check within this content type (excluding current entry)
    const slugExists = await prisma.contentEntry.findFirst({
      where: {
        id: { not: id },
        contentTypeId: contentType.id,
        // JSON path filter for slug
        data: {
          path: ['slug'],
          equals: entrySlug,
        } as any,
      },
    })
    if (slugExists) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Clean data: remove typePath from stored JSON if you don't want it persisted
    const { typePath: _typePath, ...dataToStore } = rawData || {}

    // Update only JSON data and status (schema doesn't have top-level slug/title)
    const updatedEntry = await prisma.contentEntry.update({
      where: { id },
      data: {
        status: newStatus || 'draft',
        data: dataToStore,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error('Error updating content entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    const { slug, id } = await params

    // Find the content type
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
    })

    if (!contentType) {
      return NextResponse.json({ error: 'Content type not found' }, { status: 404 })
    }

    // Check if entry exists
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id,
        contentTypeId: contentType.id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Content entry not found' }, { status: 404 })
    }

    // Delete the entry
    await prisma.contentEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
