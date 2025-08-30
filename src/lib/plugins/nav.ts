import { getPluginConfig } from './service'

export interface NavItem {
  href: string
  label: string
}

// Convert slug/typePath to Title Case label
function toTitleCase(s: string) {
  return s
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1))
}

// Get dynamic nav items from typePaths when the 'dynamic-nav' plugin is enabled.
// In mode 'auto': fetch content types from API and derive items.
// In mode 'include': use the provided list in settings.include.
export async function getDynamicTypePathNav(): Promise<NavItem[]> {
  // Require dynamic-nav enabled (API authoritative) and read its config
  let cfgApi:
    | { mode?: 'auto' | 'include'; include?: string[]; exclude?: string[]; titleCase?: boolean }
    | undefined
  try {
    const dn = await fetch('/api/plugins/dynamic-nav', { cache: 'no-store' })
    if (!dn.ok) return []
    const data = await dn.json()
    if (!data?.enabled) return []
    cfgApi = data?.config || undefined
  } catch {
    return []
  }

  // Also require Public Type Paths enabled
  try {
    const res = await fetch('/api/plugins/public-typepaths', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    if (!data?.success) return []
  } catch {
    return []
  }

  // Merge API config with local fallback
  const cfgLocal = getPluginConfig('dynamic-nav') as
    | { mode?: 'auto' | 'include'; include?: string[]; exclude?: string[]; titleCase?: boolean }
    | undefined
  const cfg = { ...(cfgLocal || {}), ...(cfgApi || {}) }

  const mode = cfg?.mode ?? 'auto'
  const exclude = new Set((cfg?.exclude ?? []).map((e) => e.toLowerCase()))
  const titleCase = cfg?.titleCase ?? true

  let typePaths: string[] = []

  if (mode === 'include') {
    typePaths = (cfg?.include ?? []).filter(Boolean)
  } else {
    try {
      const res = await fetch('/api/content-types', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        // Our API wraps data under { success, data: { contentTypes: [...] } }
        const list = Array.isArray(data?.data?.contentTypes)
          ? data.data.contentTypes
          : Array.isArray(data?.contentTypes)
            ? data.contentTypes
            : []
        // Use Prisma ContentType.apiIdentifier as typePath
        typePaths = list
          .map((ct: any) => ct?.apiIdentifier || ct?.slug || ct?.typePath || ct?.name)
          .filter(Boolean)
      }
    } catch (e) {
      console.error('getDynamicTypePathNav: failed to load content types', e)
    }
  }

  // Normalize, filter, dedupe
  const normalized = Array.from(
    new Set(
      typePaths.map((t) => String(t).trim()).filter((t) => t && !exclude.has(t.toLowerCase())),
    ),
  )

  return normalized.map((tp) => ({
    href: `/${tp}`,
    label: titleCase ? toTitleCase(tp) : tp,
  }))
}
