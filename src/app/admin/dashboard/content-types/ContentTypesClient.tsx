'use client'

import { useEffect, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { ContentTypesPage } from '@/components/admin/dashboard/ContentTypesPage'

export default function ContentTypesClient() {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/content-types', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch content types')
        const json = await res.json()
        const list = Array.isArray(json?.data) ? json.data : (json?.data?.contentTypes ?? [])
        if (!cancelled) setData(list)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error fetching content types')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading)
    return (
      <div className="relative">
        <AdminLoading
          title="Content Types"
          message="Setting up your content types..."
          variant="content"
          fullScreen
        />
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error loading content types
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  return <ContentTypesPage initialContentTypes={data || []} />
}
