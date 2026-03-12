import { redirect } from 'next/navigation'
import { ContentTypesPage } from '@/components/admin/dashboard/ContentTypesPage'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

async function getContentTypes() {
  try {
    const contentTypes = await prisma.contentType.findMany({
      include: {
        fields: true,
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    // Serialize dates to avoid hydration mismatches.
    return contentTypes.map((ct) => ({
      ...ct,
      createdAt: ct.createdAt.toISOString(),
      updatedAt: ct.updatedAt.toISOString(),
    }))
  } catch (error) {
    logger.error('Error fetching content types', error)
    return []
  }
}

export default async function ContentTypesPageRoute() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const contentTypes = await getContentTypes()
  return <ContentTypesPage initialContentTypes={contentTypes} />
}
