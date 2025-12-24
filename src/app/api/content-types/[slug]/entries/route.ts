import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

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
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching content entries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
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
    const { data: rawData, status } = body
    const { slug: entrySlug, title: entryTitle, seoOptions, isFeatured, category, tags, ...fieldData } = rawData || {}

    // Validate required fields
    if (!entrySlug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }
    if (!entryTitle) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Check if slug already exists using the new column
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        contentTypeId: contentType.id,
        slug: entrySlug,
      },
    })

    if (existingEntry) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Create the entry with dedicated columns
    const entry = await prisma.contentEntry.create({
      data: {
        status: status || 'draft',
        slug: entrySlug,
        title: entryTitle,
        seoOptions: seoOptions || {},
        isFeatured: !!isFeatured,
        category: category || null,
        tags: Array.isArray(tags) ? tags : [],
        data: fieldData,
        contentTypeId: contentType.id,
        publishedAt: status === 'published' ? new Date() : null,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating content entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
