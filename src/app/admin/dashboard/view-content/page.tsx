import { redirect } from 'next/navigation'
import { ClientOverlay } from '@/components/admin/dashboard/ViewContentPage/ClientOverlay'
import { ViewContentComponent } from '@/components/admin/dashboard/ViewContentPage/ViewContentComponent'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/server-session'

async function getContentData() {
  // Ejecutamos todas las consultas en paralelo para mayor rapidez
  const [contentTypes, allContentEntries, plans] = await Promise.all([
    // Obtenemos tipos de contenido con conteo simple
    prisma.contentType.findMany({
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5, // Solo los primeros 5 para mostrar
    }),

    // Solo contamos las entradas totales, no traemos toda la data
    prisma.contentEntry.findMany({
      select: {
        id: true,
        createdAt: true,
        contentType: {
          select: { name: true, apiIdentifier: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),

    // Solo los datos básicos de planes
    prisma.plan.findMany({
      select: {
        id: true,
        mainTitle: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return { contentTypes, plans, allContentEntries }
}

export default async function ViewContentPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const { contentTypes, plans, allContentEntries } = await getContentData()

  return (
    <ClientOverlay minDurationMs={700}>
      <ViewContentComponent
        contentTypes={contentTypes}
        plans={plans}
        allContentEntries={allContentEntries}
      />
    </ClientOverlay>
  )
}
