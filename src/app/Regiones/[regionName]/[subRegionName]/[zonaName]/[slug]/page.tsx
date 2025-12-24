import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { prisma } from '@/lib/prisma'

interface PageProps {
    params: Promise<{
        regionName: string
        subRegionName: string
        zonaName: string
        slug: string
    }>
}

async function getArticle(slug: string) {
    return await prisma.contentEntry.findUnique({
        where: { slug, status: 'published' },
        include: { contentType: true },
    })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const entry = await getArticle(slug)

    if (!entry) return {}

    const seo = entry.seoOptions as any
    return {
        title: seo?.metaTitle || entry.title,
        description: seo?.metaDescription,
        alternates: {
            canonical: seo?.canonicalUrl,
        },
        openGraph: {
            title: seo?.metaTitle || entry.title,
            description: seo?.metaDescription,
            images: seo?.featuredImage ? [{ url: seo.featuredImage }] : [],
        },
    }
}

export default async function RegionArticlePage({ params }: PageProps) {
    const { slug, regionName, subRegionName, zonaName } = await params
    const entry = await getArticle(slug)

    if (!entry) notFound()

    const data = entry.data as any
    const content = data.content || data.contenido || ''

    const seo = entry.seoOptions as any
    const featuredImage = seo?.featuredImage || data.featuredImage || data.mainImage

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <PublicNavbar />

            <main className="mx-auto max-w-4xl px-6 py-12">
                {/* Breadcrumbs */}
                <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                    <span className="capitalize">{regionName}</span>
                    <span>/</span>
                    <span className="capitalize">{subRegionName}</span>
                    <span>/</span>
                    <span className="capitalize">{zonaName}</span>
                    <span>/</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{entry.title}</span>
                </nav>

                <article className="prose prose-zinc dark:prose-invert max-w-none">
                    <header className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                            {entry.title}
                        </h1>

                        {featuredImage && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
                                <Image
                                    src={featuredImage}
                                    alt={entry.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                    </header>

                    <div
                        className="mt-8 rich-text-content"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Additional details could go here */}
                </article>
            </main>
        </div>
    )
}
