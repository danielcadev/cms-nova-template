import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { defaultConfig } from '@/lib/config'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

interface PageProps {
  params: Promise<{ typePath: string }>
}

async function getPublishedEntries(typePath: string) {
  // 1) Resolve the content type by its apiIdentifier
  const contentType = await prisma.contentType.findUnique({
    where: { apiIdentifier: typePath },
  })
  if (!contentType) return { contentType: null, entries: [] as any[] }

  // 2) Fetch published entries for this content type
  const entries = await prisma.contentEntry.findMany({
    where: {
      contentTypeId: contentType.id,
      status: 'published',
    },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, data: true, updatedAt: true, createdAt: true },
    take: 50,
  })

  return { contentType, entries }
}

export default async function TypeIndexPage({ params }: PageProps) {
  // Gate public headless routes via plugin (fallback to config flag)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/plugins/public-typepaths`,
      { cache: 'no-store' },
    )
    if (res.ok) {
      const data = await res.json()
      const enabled = !!data?.success
      if (!enabled) notFound()
    } else if (!defaultConfig.features?.publicTypePaths) {
      notFound()
    }
  } catch {
    if (!defaultConfig.features?.publicTypePaths) {
      notFound()
    }
  }

  const { typePath } = await params
  const { contentType, entries } = await getPublishedEntries(typePath)

  // If the content type doesn't exist or there are no published entries, return 404
  if (!contentType || entries.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicNavbar />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {contentType?.name || typePath}
        </h1>
        <p className="mt-2 text-sm text-gray-500">/{typePath}</p>

        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/70">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            About this section
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Browse the latest published entries for this content type.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((e) => {
            const data: any = e.data || {}
            const slug: string | undefined = data.slug
            if (!slug) return null
            const title: string = data.title || data.titulo || data.headline || data.heading || slug
            // Detect thumbnail from various keys
            const thumbCandidates = [
              'mainImage',
              'imagenPrincipal',
              'featuredImage',
              'imagenDestacada',
              'image',
              'imagen',
              'cover',
              'thumbnail',
              'thumb',
            ] as const
            let thumb: string | undefined
            for (const key of thumbCandidates) {
              const v = data?.[key as keyof typeof data]
              if (!v) continue
              if (typeof v === 'string' && v.startsWith('http')) {
                thumb = v
                break
              }
              if (typeof v === 'object' && (v as any)?.url) {
                thumb = (v as any).url
                break
              }
            }

            const summary: string | undefined = data.excerpt || data.resumen || data.summary || ''

            return (
              <Link
                key={e.id}
                href={`/${typePath}/${slug}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white/80 dark:bg-gray-900/70 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                      {title}
                    </h3>
                    {summary ? (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {summary}
                      </p>
                    ) : null}
                    <div className="mt-2 text-xs text-gray-400">
                      Updated {new Date(e.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
