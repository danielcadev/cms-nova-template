import Link from 'next/link'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function CircuitsIndexPage() {
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

        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/70">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            About this section
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a lightweight, Notion-style index for your travel circuits. Explore
            comprehensive multi-destination journeys, discover themed routes, extended adventures,
            and curated experiences that span multiple locations and cultures.
          </p>
        </div>

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
