import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { getPluginConfigServer } from '@/lib/plugins/service'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

interface PlanDetailPageProps {
  params: Promise<{
    categoria: string
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

export default async function PlanDetailPage({ params, searchParams }: PlanDetailPageProps) {
  // 404 when plugin templates disable it
  const dynCfg = (await getPluginConfigServer('dynamic-nav')) as
    | { templates?: Record<string, boolean> }
    | undefined
  const enabledByPlugin = !!dynCfg?.templates?.planes
  if (!enabledByPlugin) {
    notFound()
  }

  const { categoria: rawCategoria, slug: rawSlug } = await params
  const categoria = decodeURIComponent(rawCategoria)
  const slug = decodeURIComponent(rawSlug)
  const plan = await getPlan(categoria, slug)

  if (!plan) {
    notFound()
  }

  const spData = await searchParams

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
              <span>Category: {plan.categoryAlias}</span>
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

            {/* Price - Selected option only */}
            {Array.isArray(plan.priceOptions) && plan.priceOptions.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Price
                  </h2>
                  {/* Select option by query: ?priceId=ID or ?option=2 (1-indexed). Fallback to first */}

                  {(() => {
                    // Map currency to symbol
                    const getSymbol = (c?: string) =>
                      c === 'USD' ? 'US$' : c === 'EUR' ? '€' : '$'
                    const options = Array.isArray(plan.priceOptions) ? plan.priceOptions : []
                    const sp = spData || {}
                    const byId = sp?.priceId
                      ? options.find((o: any) => o?.id === sp.priceId)
                      : undefined
                    const idx = sp?.option ? parseInt(String(sp.option), 10) - 1 : NaN
                    const byIndex = Number.isFinite(idx) && idx >= 0 ? options[idx] : undefined
                    const chosen = byId ?? byIndex ?? options[0]

                    if (!chosen) return null

                    // Legacy option (numPersons/perPersonPrice)
                    if (typeof chosen === 'object' && 'numPersons' in chosen) {
                      const sym = getSymbol((chosen as any).currency)
                      return (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {`${(chosen as any).numPersons} personas`}
                          </h4>
                          {(chosen as any).perPersonPrice != null && (
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                              {sym} {(chosen as any).perPersonPrice}
                            </p>
                          )}
                        </div>
                      )
                    }

                    // New schema
                    const mode = (chosen as any).mode as
                      | 'simple'
                      | 'advanced'
                      | 'seasonal'
                      | undefined
                    const currency = (chosen as any).currency
                    const sym = getSymbol(currency)

                    if (mode === 'advanced') {
                      return (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {(chosen as any).label}
                          </h4>
                          {(chosen as any).price && (
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                              {sym} {(chosen as any).price}
                            </p>
                          )}
                        </div>
                      )
                    }

                    if (mode === 'simple') {
                      return (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            General price (per person)
                          </h4>
                          {(chosen as any).price && (
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                              {sym} {(chosen as any).price}
                            </p>
                          )}
                        </div>
                      )
                    }

                    if (mode === 'seasonal') {
                      // Collect all seasonal options to allow switching via dropdown
                      const allSeasonal = options.filter((o: any) => o?.mode === 'seasonal')
                      const preselectedId = (chosen as any)?.id
                      const SeasonalPricesDropdown =
                        require('@/components/public/SeasonalPricesDropdown').default as any
                      return (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <SeasonalPricesDropdown
                            options={allSeasonal as any}
                            preselectedId={preselectedId}
                          />
                        </div>
                      )
                    }

                    return null
                  })()}
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
