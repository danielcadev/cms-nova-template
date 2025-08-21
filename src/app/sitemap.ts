import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000'
  const now = new Date()
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/planes`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/circuitos`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]
}
