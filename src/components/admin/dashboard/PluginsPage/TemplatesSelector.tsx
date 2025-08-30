'use client'

import { useEffect, useState } from 'react'

type Props = {
  config: { templates?: Record<string, boolean> }
  setConfig: (updater: (p: any) => any) => void
}

export function TemplatesSelector({ config, setConfig }: Props) {
  const [available, setAvailable] = useState<string[]>([])
  const templates = config.templates || {}

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch('/api/templates/tourism', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { templates?: Array<{ name: string; path: string }> }
        const names = (data.templates || []).map((t) => t.name)
        if (active) setAvailable(names)
      } catch (e) {
        console.error('Failed to load templates list', e)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (!available.length) {
    return <div className="text-sm theme-text-secondary">No templates detected.</div>
  }

  return (
    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {available.map((name) => {
        const checked = !!templates[name]
        return (
          <label
            key={name}
            className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 border theme-border theme-card hover:theme-card-hover cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) =>
                setConfig((p: any) => ({
                  ...p,
                  templates: { ...(p.templates || {}), [name]: e.target.checked },
                }))
              }
            />
            <span className="theme-text">{name}</span>
          </label>
        )
      })}
    </div>
  )
}
