import slugify from 'slugify'

interface PlanMediaFolderOptions {
  slug?: string | null
  fallbackTitle?: string | null
  subfolder?: string | string[]
}

function normalizeSegment(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return slugify(trimmed, { lower: true, strict: true }) || null
}

export function getPlanMediaFolder({
  slug,
  fallbackTitle,
  subfolder,
}: PlanMediaFolderOptions): string {
  const normalizedSlug = normalizeSegment(slug) ?? normalizeSegment(fallbackTitle) ?? 'drafts'
  const segments: string[] = ['plans', normalizedSlug]

  if (subfolder) {
    if (Array.isArray(subfolder)) {
      for (const segment of subfolder) {
        const normalized = normalizeSegment(segment)
        if (normalized) segments.push(normalized)
      }
    } else {
      const normalized = normalizeSegment(subfolder)
      if (normalized) segments.push(normalized)
    }
  }

  return segments.join('/')
}
