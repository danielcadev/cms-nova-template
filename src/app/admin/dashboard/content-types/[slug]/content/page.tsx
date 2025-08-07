import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEntriesPage } from '@/components/admin/content/ContentEntriesPage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getContentTypeWithEntries(slug: string) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: slug },
      include: {
        fields: true,
        entries: {
          orderBy: { updatedAt: 'desc' }
        }
      }
    });
    
    if (!contentType) {
      return null;
    }
    
    return {
      ...contentType,
      createdAt: contentType.createdAt.toISOString(),
      updatedAt: contentType.updatedAt.toISOString(),
      entries: contentType.entries.map(entry => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }))
    };
  } catch (error) {
    console.error('Error fetching content type with entries:', error);
    return null;
  }
}

interface ContentEntriesPageProps {
  params: {
    slug: string;
  };
}

export default async function ContentEntriesPageRoute({ params }: ContentEntriesPageProps) {
  const contentType = await getContentTypeWithEntries(params.slug);
  
  if (!contentType) {
    notFound();
  }

  return (
    <AdminLayout>
      <ContentEntriesPage contentType={contentType} />
    </AdminLayout>
  );
}