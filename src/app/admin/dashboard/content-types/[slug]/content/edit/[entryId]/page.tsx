import { AdminLayout } from '@/components/admin/AdminLayout';
import { EditContentEntryPage } from '@/components/admin/content/EditContentEntryPage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getContentEntry(entryId: string, slug: string) {
  try {
    // Primero obtener el content type por slug
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug }
    });

    if (!contentType) {
      return null;
    }

    // Luego obtener la entrada
    const entry = await prisma.contentEntry.findUnique({
      where: { id: entryId },
      include: {
        contentType: {
          include: {
            fields: true
          }
        }
      }
    });
    
    if (!entry || entry.contentTypeId !== contentType.id) {
      return null;
    }
    
    return {
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      contentType: {
        ...entry.contentType,
        createdAt: entry.contentType.createdAt.toISOString(),
        updatedAt: entry.contentType.updatedAt.toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching content entry:', error);
    return null;
  }
}

interface EditContentEntryPageProps {
  params: {
    slug: string;
    entryId: string;
  };
}

export default async function EditContentEntryPageRoute({ params }: EditContentEntryPageProps) {
  const entry = await getContentEntry(params.entryId, params.slug);
  
  if (!entry) {
    notFound();
  }

  return (
    <AdminLayout>
      <EditContentEntryPage entry={entry} />
    </AdminLayout>
  );
}