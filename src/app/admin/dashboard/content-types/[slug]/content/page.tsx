import { notFound } from 'next/navigation'
import { ContentEntriesPage } from '@/components/admin/content-types/ContentEntriesPage'
import { prisma } from '@/lib/prisma'

async function getContentTypeWithEntries(slug: string) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: true,
        entries: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    })
    if (!contentType) {
      return null
    }
    return {
      ...contentType,
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString(),
      entries: contentType.entries.map((entry) => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error('Error fetching content type with entries:', error)
    return null
  }
}

interface ContentEntriesPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ContentEntriesPageRoute({ params }: ContentEntriesPageProps) {
  const { slug } = await params
  const contentType = await getContentTypeWithEntries(slug)

  if (!contentType) {
    notFound()
  }

  return <ContentEntriesPage contentType={contentType} />
}
