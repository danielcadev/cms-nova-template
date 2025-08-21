import { ContentTypesPage } from '@/components/admin/dashboard/ContentTypesPage'
import { prisma } from '@/lib/prisma'

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
  const contentTypes = await getContentTypes()
  return <ContentTypesPage initialContentTypes={contentTypes} />
}
