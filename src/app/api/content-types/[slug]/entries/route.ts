import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // First, find the content type
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
    })

    if (!contentType) {
      return NextResponse.json({ error: 'Content type not found' }, { status: 404 })
    }

    // Get entries for this content type
    const entries = await prisma.contentEntry.findMany({
      where: { contentTypeId: contentType.id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching content entries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const body = await request.json()

    // Get the current user session
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Extract data and status from body
    const { data, status } = body
    const { slug: entrySlug, typePath: _typePath, ...fieldData } = data || {}

    // Try to extract title from field data (look for common title field patterns)
    const titleField = contentType.fields.find(
      (f) =>
        f.type === 'TEXT' &&
        (/(title|titulo|headline|heading)/i.test(f.apiIdentifier) ||
          /(title|t[íi]tulo|titulo|headline|heading)/i.test(f.label)),
    )
    const title = titleField ? fieldData[titleField.apiIdentifier] : entrySlug

    // Validate required fields
    if (!entrySlug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Check if slug already exists
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        slug: entrySlug,
        contentTypeId: contentType.id,
      },
    })

    if (existingEntry) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Create the entry
    const entry = await prisma.contentEntry.create({
      data: {
        title,
        slug: entrySlug,
        status: status || 'draft',
        data: fieldData,
        contentTypeId: contentType.id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating content entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
