'use client';

import { TouristPlansView } from '@/components/templates/TemplatesManager/TouristPlansView';
import { usePlans } from '@/components/templates/TemplatesManager/usePlans';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function TourismPage() {
  const { plans, isLoading, error, refreshPlans } = usePlans();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates');
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el plan');
      }

      // Refrescar la lista de planes
      if (refreshPlans) {
        await refreshPlans();
      }
      
    } catch (error) {
      throw error; // Re-throw para que TouristPlansView pueda manejar el error
    }
  };

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
  );
}
