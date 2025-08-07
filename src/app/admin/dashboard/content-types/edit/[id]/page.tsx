import { AdminLayout } from '@/components/admin/AdminLayout';
import { CreateContentTypePage } from '@/components/admin/dashboard/CreateContentTypePage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getContentType(id: string) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { id },
      include: {
        fields: true,
      }
    });
    
    if (!contentType) {
      return null;
    }
    
    // Serializar las fechas para evitar problemas de hidratación
    return {
      ...contentType,
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString(),
      fields: contentType.fields
    };
  } catch (error) {
    console.error('Error fetching content type:', error);
    return null;
  }
}

interface EditContentTypePageProps {
  params: {
    id: string;
  };
}

export default async function EditContentTypePage({ params }: EditContentTypePageProps) {
  const contentType = await getContentType(params.id);
  
  if (!contentType) {
    notFound();
  }

  return (
    <AdminLayout>
      <CreateContentTypePage initialData={contentType} contentTypeId={params.id} />
    </AdminLayout>
  );
}