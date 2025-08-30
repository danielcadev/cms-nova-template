'use client'

import { useEffect, useMemo, useState } from 'react'

type Props = {
  mode: 'auto' | 'include'
  include: string[]
  setInclude: (list: string[]) => void
}

export function TypePathsSelector({ mode, include, setInclude }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [available, setAvailable] = useState<string[]>([])

  useEffect(() => {
    let active = true
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/content-types', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load content types')
        const data = await res.json()
        const raw = Array.isArray(data?.data?.contentTypes)
          ? data.data.contentTypes
          : Array.isArray(data?.contentTypes)
            ? data.contentTypes
            : []
        const list: string[] = raw
          .map(
            (ct: any) =>
              ct?.apiIdentifier || ct?.slug || ct?.typePath || (ct?.name ? slugify(ct.name) : ''),
          )
          .filter(Boolean)
        if (active) setAvailable(list)
      } catch (e: any) {
        if (active) setError(e?.message || 'Error loading type paths')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const selected = useMemo(() => new Set((include || []).map((s) => s.toLowerCase())), [include])

  const toggle = (name: string, checked: boolean) => {
    const n = name.trim()
    if (!n) return
    const base = new Set(include)
    if (checked) base.add(n)
    else base.delete(n)
    setInclude(Array.from(base))
  }

  if (mode !== 'include') {
    return (
      <div className="rounded-lg border theme-border p-3 text-sm theme-text-secondary">
        In Auto mode, all typePaths defined in your Content Types are used automatically.
      </div>
    )
  }

  if (loading) return <div className="text-sm theme-text-secondary">Loading typePaths...</div>
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!available.length)
    return <div className="text-sm theme-text-secondary">No Content Types yet.</div>

  return (
    <div className="mt-1 flex flex-wrap gap-4">
      {available.map((name) => {
        const checked = selected.has(String(name).toLowerCase())
        return (
          <label key={name} className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => toggle(name, e.target.checked)}
            />
            {name}
          </label>
        )
      })}
    </div>
  )
}
