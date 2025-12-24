import { notFound } from 'next/navigation'
import { EditContentEntryPage } from '@/components/admin/content-types/EditContentEntryPage'
import { prisma } from '@/lib/prisma'

async function getContentEntry(slug: string, entryId: string) {
  try {
    const entry = await prisma.contentEntry.findFirst({
      where: {
        id: entryId,
        contentType: {
          apiIdentifier: slug,
        },
      },
      include: {
        contentType: {
          include: {
            fields: true,
          },
        },
      },
    })

    if (!entry) {
      return null
    }

    return {
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      contentType: {
        ...entry.contentType,
        createdAt: entry.contentType.createdAt.toISOString(),
        updatedAt: entry.contentType.updatedAt.toISOString(),
      },
    }
  } catch (error) {
    console.error('Error fetching content entry:', error)
    return null
  }
}

interface EditContentEntryPageRouteProps {
  params: Promise<{
    slug: string
    id: string
  }>
}

export default async function EditContentEntryPageRoute({
  params,
}: EditContentEntryPageRouteProps) {
  const { slug, id } = await params
  const entry = await getContentEntry(slug, id)

  if (!entry) {
    notFound()
  }

  return <EditContentEntryPage entry={entry} />
}
