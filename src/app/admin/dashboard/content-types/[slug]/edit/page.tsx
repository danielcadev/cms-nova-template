import { notFound } from 'next/navigation'
import ContentTypeForm from '@/components/admin/content-types/ContentTypesManager/components/ContentTypeForm'
import { prisma } from '@/lib/prisma'

async function getContentType(slug: string) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: { fields: true },
    })
    if (!contentType) return null
    return {
      ...contentType,
      description: contentType.description ?? undefined,
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching content type by slug:', error)
    return null
  }
}

interface EditContentTypePageProps {
  params: Promise<{ slug: string }>
}

export default async function EditContentTypePageRoute({ params }: EditContentTypePageProps) {
  const { slug } = await params
  const contentType = await getContentType(slug)
  if (!contentType) notFound()

  return <ContentTypeForm initialData={contentType} contentTypeId={contentType.id} />
}
