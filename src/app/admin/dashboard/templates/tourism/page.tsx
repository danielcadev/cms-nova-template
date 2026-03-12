'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TouristPlansView, usePlans } from '@/verticals/tourism'

export default function TourismPage() {
  const router = useRouter()
  const { plans, isLoading, error, refreshPlans, deletePlan, duplicatePlan, togglePublished } =
    usePlans()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleGoBack = useCallback(() => {
    router.push('/admin/dashboard/templates')
  }, [router])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshPlans()
      return true
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshPlans])

  const handleDeletePlan = useCallback(
    async (planId: string) => {
      const success = await deletePlan(planId)
      if (!success) throw new Error('Could not delete the plan')
      return true
    },
    [deletePlan],
  )

  const handleDuplicatePlan = useCallback(
    async (planId: string) => {
      const duplicated = await duplicatePlan(planId)
      if (!duplicated) throw new Error('Could not duplicate the plan')
      return duplicated
    },
    [duplicatePlan],
  )

  const handleTogglePublished = useCallback(
    async (planId: string) => {
      const success = await togglePublished(planId)
      if (!success) throw new Error('Could not update plan state')
      return success
    },
    [togglePublished],
  )

  return (
    <AdminLayout>
      <TouristPlansView
        plans={plans}
        isLoading={isLoading}
        error={error}
        onBack={handleGoBack}
        onDeletePlan={handleDeletePlan}
        onDuplicatePlan={handleDuplicatePlan}
        onTogglePublished={(planId, _next) => handleTogglePublished(planId)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </AdminLayout>
  )
}
