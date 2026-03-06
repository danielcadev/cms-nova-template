import { redirect } from 'next/navigation'
import { ContentTypesPage } from '@/components/admin/dashboard/ContentTypesPage'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/server-session'

async function getContentTypes() {
  try {
    const contentTypes = await prisma.contentType.findMany({
      include: {
        fields: true,
        _count: { select: { entries: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return contentTypes.map((ct) => ({
      ...ct,
      createdAt: ct.createdAt.toISOString(),
      updatedAt: ct.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching content types:', error)
    return [] as any[]
  }
}

export default async function ContentTypesServer() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const contentTypes = await getContentTypes()
  return <ContentTypesPage initialContentTypes={contentTypes} />
}
