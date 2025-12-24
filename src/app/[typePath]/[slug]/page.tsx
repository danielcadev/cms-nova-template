import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { defaultConfig } from '@/config/default-config'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

interface PageProps {
  params: Promise<{ typePath: string; slug: string }>
}

async function getEntry(typePath: string, slug: string) {
  const contentType = await prisma.contentType.findUnique({
    where: { apiIdentifier: typePath },
    include: { fields: true },
  })
  if (!contentType) return null

  const entry = await prisma.contentEntry.findFirst({
    where: {
      contentTypeId: contentType.id,
      status: 'published',
      slug,
    },
  })
  if (!entry) return null

  return { contentType, entry }
}

export default async function PublicEntryPage({ params }: PageProps) {
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

  const { typePath, slug } = await params
  const result = await getEntry(typePath, slug)
  if (!result) notFound()

  const { contentType, entry } = result
  const data = entry.data as any

  const title = data.title || data.titulo || data.headline || data.heading || data.postTitle || slug

  // Extract image URL with robust rules
  const getUrlFromValue = (v: any): string | undefined => {
    if (!v) return undefined
    if (typeof v === 'string') return v
    if (typeof v === 'object') {
      // common shapes
      if (typeof v.url === 'string') return v.url
      if (Array.isArray(v)) {
        for (const item of v) {
          const u = getUrlFromValue(item)
          if (u) return u
        }
      }
    }
    return undefined
  }

  // Candidates from common names + any MEDIA fields in schema
  const schemaMediaKeys = (contentType?.fields || [])
    .filter((f) => f.type === 'MEDIA')
    .map((f) => f.apiIdentifier)

  const mediaCandidates = [
    'mainImage',
    'imagenPrincipal',
    'featuredImage',
    'imagenDestacada',
    'image',
    'imagen',
    'cover',
    'thumbnail',
    'thumb',
    ...schemaMediaKeys,
  ]

  let mainImage: string | undefined
  for (const key of mediaCandidates) {
    const u = getUrlFromValue(data?.[key])
    if (u) {
      mainImage = u
      break
    }
  }

  // Normalize relative URLs
  if (mainImage?.startsWith('/')) {
    // Let Next/Image or <img> handle it relative to site root
  }

  // Determine main rich text content
  const richTextFields = (contentType?.fields || []).filter((f) => f.type === 'RICH_TEXT')
  const mainRichField = richTextFields[0]?.apiIdentifier
  const mainHtml = (mainRichField && data?.[mainRichField]) || data.content || data.contenido || ''

  // Helper to gather all media URLs from any shape
  const getAllUrlsFromValue = (v: any): string[] => {
    const urls: string[] = []
    const visit = (val: any) => {
      if (!val) return
      if (typeof val === 'string') {
        urls.push(val)
        return
      }
      if (Array.isArray(val)) {
        for (const item of val) visit(item)
        return
      }
      if (typeof val === 'object') {
        if (typeof val.url === 'string') urls.push(val.url)
        // Also traverse nested objects
        for (const key of Object.keys(val)) visit(val[key])
      }
    }
    visit(v)
    // Deduplicate
    return Array.from(new Set(urls))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicNavbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
          <Link href={`/${typePath}`} className="hover:text-gray-700 dark:hover:text-gray-300">
            {typePath}
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{slug}</span>
        </div>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              {title}
            </h1>
          </header>

          {mainImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <Image
                src={mainImage}
                alt={title}
                width={1600}
                height={900}
                className="w-full h-64 md:h-96 object-cover"
                priority
              />
            </div>
          )}

          {/* Main rich text (if any) */}
          {mainHtml && (
            <div
              className="prose prose-gray dark:prose-invert max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: mainHtml }}
            />
          )}

          {/* Render all fields from ContentType */}
          <section className="not-prose">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Details</h2>
            <div className="space-y-6">
              {(contentType?.fields || []).map((field) => {
                const key = field.apiIdentifier
                const value = data?.[key]
                if (value == null) return null

                // Skip slug and the main rich text already rendered above
                if (key === 'slug') return null
                if (mainRichField && key === mainRichField) return null

                const label = field.label || key
                const type = field.type

                // Render per type
                if (type === 'RICH_TEXT') {
                  return (
                    <div key={key}>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {label}
                      </h3>
                      <div
                        className="prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: String(value || '') }}
                      />
                    </div>
                  )
                }

                if (type === 'MEDIA') {
                  const urls = getAllUrlsFromValue(value)
                  if (!urls.length) return null
                  return (
                    <div key={key}>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {label}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {urls.map((u, idx) => (
                          <div
                            key={u}
                            className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
                          >
                            <Image
                              src={u}
                              alt={`${label} ${idx + 1}`}
                              width={400}
                              height={256}
                              className="w-full h-32 object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }

                if (type === 'BOOLEAN') {
                  const v = !!value
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {label}:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                      >
                        {v ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )
                }

                if (type === 'NUMBER') {
                  const n = typeof value === 'number' ? value : Number(value)
                  return (
                    <div key={key}>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {label}:
                      </span>{' '}
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {Number.isNaN(n) ? String(value) : n}
                      </span>
                    </div>
                  )
                }

                if (type === 'DATE') {
                  const d = new Date(value)
                  const formatted = Number.isNaN(d.getTime())
                    ? String(value)
                    : d.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  return (
                    <div key={key}>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {label}:
                      </span>{' '}
                      <span className="text-sm text-gray-900 dark:text-gray-100">{formatted}</span>
                    </div>
                  )
                }

                // TEXT and fallback
                return (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {label}:
                    </span>{' '}
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
