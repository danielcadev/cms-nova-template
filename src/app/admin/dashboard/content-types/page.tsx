import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentTypesPage } from '@/components/admin/dashboard/ContentTypesPage';
import { prisma } from '@/lib/prisma';

async function getContentTypes() {
  try {
    const contentTypes = await prisma.contentType.findMany({
      include: {
        fields: true,
        _count: {
          select: { entries: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Serializar las fechas para evitar problemas de hidratación
    return contentTypes.map(ct => ({
      ...ct,
      createdAt: ct.createdAt.toISOString(),
      updatedAt: ct.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching content types:', error);
    return [];
  }
}

export default async function ContentTypesPageRoute() {
  const contentTypes = await getContentTypes();

  return (
    <AdminLayout>
      <ContentTypesPage initialContentTypes={contentTypes} />
    </AdminLayout>
  );
}
