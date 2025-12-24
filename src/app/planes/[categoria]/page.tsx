import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { getPluginConfigServer } from '@/lib/plugins/service'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

interface PlansByCategoryPageProps {
  params: Promise<{
    categoria: string
  }>
}

async function getPlansByCategory(categoria: string) {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        published: true,
        section: 'planes',
        categoryAlias: categoria,
      },
      select: {
        id: true,
        mainTitle: true,
        articleAlias: true,
        promotionalText: true,
        categoryAlias: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return plans.map((plan) => ({
      id: plan.id,
      title: plan.mainTitle,
      slug: plan.articleAlias,
      description: plan.promotionalText,
      categoryAlias: plan.categoryAlias,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    }))
  } catch {
    return []
  }
}

export default async function PlansByCategoryPage({ params }: PlansByCategoryPageProps) {
  // 404 when plugin templates disable it
  const dynCfg = (await getPluginConfigServer('dynamic-nav')) as
    | { templates?: Record<string, boolean> }
    | undefined
  const enabledByPlugin = !!dynCfg?.templates?.planes
  if (!enabledByPlugin) {
    notFound()
  }

  const { categoria: rawCategoria } = await params
  const categoria = decodeURIComponent(rawCategoria)
  const plans = await getPlansByCategory(categoria)

  // 404 if no published entries for this category
  if (plans.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicNavbar />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6">
          <Link
            href="/planes"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ← Back to all categories
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {categoria}
        </h1>
        <p className="mt-2 text-sm text-gray-500">/planes/{categoria}</p>

        <div className="mt-8 grid grid-cols-1 gap-6">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/planes/${categoria}/${plan.slug}`}
              className="group rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white/80 dark:bg-gray-900/70 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {plan.title}
                  </h3>
                  {plan.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {plan.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-gray-500">
                    Created {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform ml-4">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
