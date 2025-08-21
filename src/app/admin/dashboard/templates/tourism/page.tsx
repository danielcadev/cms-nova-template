'use client'

import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TouristPlansView } from '@/components/templates/TemplatesManager/TouristPlansView'
import { usePlans } from '@/components/templates/TemplatesManager/usePlans'

export default function TourismPage() {
  const { plans, isLoading, error, refreshPlans } = usePlans()
  const router = useRouter()

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates')
  }

  const handleDeletePlan = async (planId: string) => {
    const response = await fetch(`/api/plans/${planId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el plan')
    }

    // Refrescar la lista de planes
    if (refreshPlans) {
      await refreshPlans()
    }
  }

  return (
    <AdminLayout>
      <TouristPlansView
        plans={plans}
        isLoading={isLoading}
        error={error}
        onBack={handleGoBack}
        onDeletePlan={handleDeletePlan}
      />
    </AdminLayout>
  )
}
