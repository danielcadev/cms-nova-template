'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Plan } from '@/types/form'

type ApiPlansListResponse = { success: true; plans: Plan[] } | { success: false; error?: string }

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshPlans = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/plans', { cache: 'no-store' })
      const data = (await res.json().catch(() => null)) as ApiPlansListResponse | null

      if (!res.ok || !data || !('success' in data) || data.success !== true) {
        const msg = (data as any)?.error || 'Failed to load plans'
        throw new Error(msg)
      }

      setPlans(Array.isArray(data.plans) ? data.plans : [])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load plans'
      setPlans([])
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshPlans()
  }, [refreshPlans])

  const togglePublished = useCallback(
    async (id: string): Promise<boolean> => {
      const plan = plans.find((p) => p.id === id)
      if (!plan) return false

      try {
        const res = await fetch(`/api/plans/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: !plan.published }),
        })
        if (!res.ok) return false
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)))
        return true
      } catch {
        return false
      }
    },
    [plans],
  )

  const deletePlan = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' })
      if (!res.ok) return false
      setPlans((prev) => prev.filter((p) => p.id !== id))
      return true
    } catch {
      return false
    }
  }, [])

  const duplicatePlan = useCallback(
    async (id: string): Promise<Plan | null> => {
      try {
        const res = await fetch(`/api/plans/${id}/duplicate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = (await res.json().catch(() => null)) as any
        if (!res.ok || !data?.success) return null

        const created = (data?.plan || data?.data?.plan || null) as Plan | null
        if (created) {
          setPlans((prev) => [created, ...prev])
        } else {
          await refreshPlans()
        }
        return created
      } catch {
        return null
      }
    },
    [refreshPlans],
  )

  return {
    plans,
    isLoading,
    error,
    refreshPlans,
    togglePublished,
    deletePlan,
    duplicatePlan,
  }
}
