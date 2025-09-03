import { type NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // For now, we'll return mock data since we don't have a tourism templates table
    // In a real implementation, you would query your tourism templates table
    const mockTemplate = {
      id,
      title: 'Amazing Costa Rica Adventure',
      slug: 'costa-rica-adventure',
      description:
        'Discover the natural wonders of Costa Rica with this comprehensive adventure package.',
      duration: '7 days 6 nights',
      price: 1299,
      category: 'adventure',
      status: 'published',
      features: [
        'Professional tour guide',
        'All meals included',
        'Transportation',
        'Adventure activities',
        'Wildlife watching',
      ],
      images: ['/images/costa-rica-1.jpg', '/images/costa-rica-2.jpg'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in San José',
          description: 'Welcome to Costa Rica! Transfer to hotel and city tour.',
          activities: ['Airport pickup', 'Hotel check-in', 'City tour', 'Welcome dinner'],
        },
        {
          day: 2,
          title: 'Manuel Antonio National Park',
          description: 'Explore the beautiful beaches and wildlife of Manuel Antonio.',
          activities: ['Beach time', 'Wildlife watching', 'Hiking trails', 'Sunset viewing'],
        },
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
    }

    return NextResponse.json(mockTemplate)
  } catch (error) {
    console.error('Error fetching tourism template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await _request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.price) {
      return NextResponse.json({ error: 'Title, slug, and price are required' }, { status: 400 })
    }

    // For now, we'll return the updated mock data
    // In a real implementation, you would update your tourism templates table
    const updatedTemplate = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Error updating tourism template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // For now, we'll just return success
    // In a real implementation, you would delete from your tourism templates table
    console.log(`Deleting tourism template: ${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tourism template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
