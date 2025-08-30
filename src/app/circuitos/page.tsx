import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { getPluginConfigServer } from '@/lib/plugins/service'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function CircuitsIndexPage() {
  // 404 when plugin templates disable it
  const dynCfg = (await getPluginConfigServer('dynamic-nav')) as
    | { templates?: Record<string, boolean> }
    | undefined
  const enabledByPlugin = !!dynCfg?.templates?.circuitos
  if (!enabledByPlugin) {
    notFound()
  }

  const plans = await prisma.plan.findMany({
    where: { published: true, section: 'circuitos' },
    select: { categoryAlias: true },
  })
  const categories = Array.from(
    new Set(plans.map((p) => (p.categoryAlias || '').trim()).filter(Boolean)),
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicNavbar />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Circuits by category
        </h1>
        <p className="mt-2 text-sm text-gray-500">/circuitos</p>

        {categories.length === 0 ? (
          <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center bg-white/70 dark:bg-gray-900/70">
            <p className="text-sm text-gray-600 dark:text-gray-400">No published circuits yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/circuitos/${cat}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white/80 dark:bg-gray-900/70 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{cat}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      View all circuits in this category
                    </p>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
