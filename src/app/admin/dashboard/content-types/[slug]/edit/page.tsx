import { notFound } from 'next/navigation'
import ContentTypeForm from '@/components/admin/content-types/ContentTypesManager/ContentTypeForm'
import { CreateContentTypeHeader } from '@/components/admin/dashboard/CreateContentTypePage/CreateContentTypeHeader'
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
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching content type by slug:', error)
    return null
  }
}

interface EditContentTypePageProps {
  params: { slug: string }
}

export default async function EditContentTypePageRoute({ params }: EditContentTypePageProps) {
  const contentType = await getContentType(params.slug)
  if (!contentType) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <CreateContentTypeHeader isEditing initialData={contentType} />
        </div>

        <div className="mt-4">
          <ContentTypeForm initialData={contentType} contentTypeId={contentType.id} />
        </div>
      </div>
    </div>
  )
}
