import { redirect } from 'next/navigation'
import { ClientOverlay } from '@/components/admin/dashboard/ViewContentPage/ClientOverlay'
import { ViewContentComponent } from '@/components/admin/dashboard/ViewContentPage/ViewContentComponent'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'

async function getContentData() {
  // Run all queries in parallel for speed.
  const [contentTypes, allContentEntries, plans] = await Promise.all([
    // Content types with a simple entries count.
    prisma.contentType.findMany({
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5, // Only the first 5 for the dashboard
    }),

    // Recent entries (metadata only).
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

    // Recent plans (basic fields only).
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
