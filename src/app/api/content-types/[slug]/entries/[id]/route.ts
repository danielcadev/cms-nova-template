import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { slug, id } = params

    // Find the content type
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      )
    }

    // Get the specific entry
    const entry = await prisma.contentEntry.findFirst({
      where: {
        id,
        contentTypeId: contentType.id
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      )
    }

    // Include content type info in response
    const response = {
      ...entry,
      contentType
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching content entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { slug, id } = params
    const body = await request.json()

    // Find the content type
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug }
    })

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      )
    }

    // Check if entry exists
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id,
        contentTypeId: contentType.id
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      )
    }

    // Extract basic fields
    const { title, slug: entrySlug, status, ...fieldData } = body

    // Validate required fields
    if (!title || !entrySlug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists (excluding current entry)
    const slugExists = await prisma.contentEntry.findFirst({
      where: {
        slug: entrySlug,
        contentTypeId: contentType.id,
        NOT: { id }
      }
    })

    if (slugExists) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    // Update the entry
    const updatedEntry = await prisma.contentEntry.update({
      where: { id },
      data: {
        title,
        slug: entrySlug,
        status: status || 'draft',
        data: fieldData,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error('Error updating content entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { slug, id } = params

    // Find the content type
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug }
    })

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      )
    }

    // Check if entry exists
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id,
        contentTypeId: contentType.id
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      )
    }

    // Delete the entry
    await prisma.contentEntry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}