import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { getPluginConfigServer } from '@/lib/plugins/service'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

interface PlanDetailPageProps {
  params: {
    categoria: string
    slug: string
  }
}

async function getPlan(categoria: string, slug: string) {
  try {
    const plan = await prisma.plan.findFirst({
      where: {
        published: true,
        section: 'planes',
        categoryAlias: categoria,
        articleAlias: slug,
      },
      select: {
        id: true,
        mainTitle: true,
        articleAlias: true,
        promotionalText: true,
        attractionsTitle: true,
        attractionsText: true,
        transfersTitle: true,
        transfersText: true,
        holidayTitle: true,
        holidayText: true,
        includes: true,
        notIncludes: true,
        itinerary: true,
        priceOptions: true,
        generalPolicies: true,
        transportOptions: true,
        allowGroundTransport: true,
        videoUrl: true,
        mainImage: true,
        categoryAlias: true,
        destination: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!plan) {
      return null
    }

    return {
      ...plan,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    }
  } catch {
    return null
  }
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  // 404 when plugin templates disable it
  const dynCfg = (await getPluginConfigServer('dynamic-nav')) as
    | { templates?: Record<string, boolean> }
    | undefined
  const enabledByPlugin = !!dynCfg?.templates?.planes
  if (!enabledByPlugin) {
    notFound()
  }

  const categoria = decodeURIComponent(params.categoria)
  const slug = decodeURIComponent(params.slug)
  const plan = await getPlan(categoria, slug)

  if (!plan) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicNavbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/planes" className="hover:text-gray-700 dark:hover:text-gray-300">
            planes
          </Link>
          <span>/</span>
          <Link
            href={`/planes/${categoria}`}
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            {categoria}
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{plan.articleAlias}</span>
        </div>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              {plan.mainTitle}
            </h1>

            {plan.promotionalText && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {plan.promotionalText}
              </p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Destination: {plan.destination?.name || plan.categoryAlias}</span>
              <span>•</span>
              <span>Updated {new Date(plan.updatedAt).toLocaleDateString()}</span>
              {plan.allowGroundTransport && (
                <>
                  <span>•</span>
                  <span>Ground Transport Available</span>
                </>
              )}
            </div>
          </header>

          {/* Main Image */}
          {plan.mainImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <Image
                src={
                  typeof plan.mainImage === 'string'
                    ? (plan.mainImage as string)
                    : (plan.mainImage as any)?.url || ''
                }
                alt={plan.mainTitle}
                width={1600}
                height={900}
                className="w-full h-64 md:h-96 object-cover"
                priority
              />
            </div>
          )}

          {/* Plan Content */}
          <div className="space-y-8">
            {/* Attractions Section */}
            {plan.attractionsTitle && plan.attractionsText && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {plan.attractionsTitle}
                  </h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>{plan.attractionsText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transfers Section */}
            {plan.transfersTitle && plan.transfersText && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {plan.transfersTitle}
                  </h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>{plan.transfersText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Holiday Section */}
            {plan.holidayTitle && plan.holidayText && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {plan.holidayTitle}
                  </h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>{plan.holidayText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Includes/Not Includes */}
            <div className="grid md:grid-cols-2 gap-6">
              {plan.includes && (
                <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/70 dark:bg-green-900/20">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                      What's Included
                    </h3>
                    <div className="prose prose-green dark:prose-invert max-w-none text-sm">
                      {typeof plan.includes === 'string' ? (
                        <p>{plan.includes}</p>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(plan.includes) }} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {plan.notIncludes && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
                      Not Included
                    </h3>
                    <div className="prose prose-red dark:prose-invert max-w-none text-sm">
                      <p>{plan.notIncludes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {plan.itinerary && Array.isArray(plan.itinerary) && plan.itinerary.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Itinerary
                  </h2>
                  <div className="space-y-4">
                    {plan.itinerary.map((day: any, index: number) => {
                      const key = `${day?.day ?? index}-${day?.title ?? 'day'}`
                      return (
                        <div
                          key={key}
                          className="border-l-4 border-gray-300 dark:border-gray-600 pl-4"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            Day {index + 1}: {day.title || `Day ${index + 1}`}
                          </h4>
                          {day.description && (
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {day.description}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Price Options */}
            {plan.priceOptions &&
              Array.isArray(plan.priceOptions) &&
              plan.priceOptions.length > 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                      Pricing Options
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plan.priceOptions.map((option: any, index: number) => {
                        const key = `${option?.id ?? index}-${option?.title ?? 'opt'}`
                        return (
                          <div
                            key={key}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {option.title || `Option ${index + 1}`}
                            </h4>
                            {option.price && (
                              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                                ${option.price}
                              </p>
                            )}
                            {option.description && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                {option.description}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

            {/* Video */}
            {plan.videoUrl && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Video Preview
                  </h2>
                  <div className="aspect-video">
                    <iframe
                      src={plan.videoUrl}
                      className="w-full h-full rounded-lg"
                      title={`Video preview: ${plan.mainTitle}`}
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}

            {/* General Policies */}
            {plan.generalPolicies && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    General Policies
                  </h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>{plan.generalPolicies}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
