'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TouristPlansView } from '@/components/templates/TemplatesManager/TouristPlansView'
import { usePlans } from '@/hooks/usePlans'

export default function PlansPage() {
  const router = useRouter()
  const { plans, isLoading, error, refreshPlans, deletePlan, duplicatePlan, togglePublished } =
    usePlans()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleGoBack = useCallback(() => {
    router.push('/admin/dashboard')
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
      if (!success) throw new Error('No se pudo eliminar el plan')
      return true
    },
    [deletePlan],
  )

  const handleDuplicatePlan = useCallback(
    async (planId: string) => {
      const duplicated = await duplicatePlan(planId)
      if (!duplicated) throw new Error('No se pudo duplicar el plan')
      return duplicated
    },
    [duplicatePlan],
  )

  const handleTogglePublished = useCallback(
    async (planId: string) => {
      const success = await togglePublished(planId)
      if (!success) throw new Error('No se pudo actualizar el estado del plan')
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
