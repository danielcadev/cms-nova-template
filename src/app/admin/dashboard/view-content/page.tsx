import { AdminLayout } from '@/components/admin/AdminLayout';
import { ViewContentComponent } from '@/components/admin/dashboard/ViewContentPage/ViewContentComponent';
import { prisma } from '@/lib/prisma';

async function getContentData() {
  // Obtenemos tipos de contenido con sus entradas
  const contentTypes = await prisma.contentType.findMany({
    include: {
      _count: {
        select: { entries: true }
      },
      entries: {
        orderBy: { createdAt: 'desc' },
        take: 5, // Últimas 5 entradas por tipo
      }
    },
    orderBy: { createdAt: 'desc' },
  });
  
  // Obtenemos todas las entradas de contenido para el contador total
  const allContentEntries = await prisma.contentEntry.findMany({
    include: {
      contentType: {
        select: { name: true, apiIdentifier: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // Últimas 10 entradas globales
  });
  
  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5, // Tomamos solo los 5 más recientes como ejemplo
  });
  
  return { contentTypes, plans, allContentEntries };
}

export default async function ViewContentPage() {
  const { contentTypes, plans, allContentEntries } = await getContentData();

  return (
    <AdminLayout>
      <ViewContentComponent 
        contentTypes={contentTypes}
        plans={plans}
        allContentEntries={allContentEntries}
      />
    </AdminLayout>
  );
} 
