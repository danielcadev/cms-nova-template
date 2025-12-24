import { notFound } from 'next/navigation'
import { CreateContentEntryPage } from '@/components/admin/content-types/CreateContentEntryPage'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'

async function getContentType(slug: string) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: true,
      },
    })
    if (!contentType) {
      return null
    }
    return {
      ...contentType,
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching content type:', error)
    return null
  }
}

interface CreateContentEntryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CreateContentEntryPageRoute({ params }: CreateContentEntryPageProps) {
  const { slug } = await params
  const contentType = await getContentType(slug)

  if (!contentType) {
    notFound()
  }

  return (
    <CreateContentEntryPage contentType={contentType} />
  )
}
