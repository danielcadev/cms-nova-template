import { redirect } from 'next/navigation'
import { EditContentEntryPage } from '@/components/admin/content-types/EditContentEntryPage'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'

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
      publishedAt: entry.publishedAt ? entry.publishedAt.toISOString() : null,
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
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const { slug, id } = await params
  const entry = await getContentEntry(slug, id)

  if (!entry) {
    redirect('/404')
  }

  return <EditContentEntryPage entry={entry} />
}
