import { redirect } from 'next/navigation'
import ContentTypeForm from '@/components/admin/content-types/ContentTypesManager/components/ContentTypeForm'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'

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
      fields: contentType.fields.map((field) => ({
        ...field,
        slugRoute: (field.metadata as any)?.slugRoute,
        isList: (field.metadata as any)?.isList,
        options: Array.isArray((field.metadata as any)?.options)
          ? ((field.metadata as any).options as string[]).join(', ')
          : undefined,
      })),
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
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const { slug } = await params
  const contentType = await getContentType(slug)
  if (!contentType) redirect('/404')

  return <ContentTypeForm initialData={contentType} contentTypeId={contentType.id} />
}
