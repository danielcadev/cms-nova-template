import { AdminLayout } from '@/components/admin/AdminLayout';
import { CreateContentEntryPage } from '@/components/admin/content/CreateContentEntryPage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getContentType(slug: string) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: true
      }
    });
    
    if (!contentType) {
      return null;
    }
    
    return {
      ...contentType,
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching content type:', error);
    return null;
  }
}

interface CreateContentEntryPageProps {
  params: {
    slug: string;
  };
}

export default async function CreateContentEntryPageRoute({ params }: CreateContentEntryPageProps) {
  const contentType = await getContentType(params.slug);
  
  if (!contentType) {
    notFound();
  }

  return (
    <AdminLayout>
      <CreateContentEntryPage contentType={contentType} />
    </AdminLayout>
  );
}