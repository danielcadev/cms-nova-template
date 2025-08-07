// hooks/usePlans.ts
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Plan } from '@/types/form';

export function usePlans(onPlanUpdate?: (plan: Plan) => void) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Solicitar todos los planes con un límite alto para evitar paginación
      const response = await fetch('/api/plans?limit=1000');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al cargar los planes');
      }
      
      // Verificar la estructura de los datos
      const plans = data.data || data.plans || [];
      setPlans(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      const message = error instanceof Error ? error.message : 'Error al cargar los planes';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const togglePublished = async (id: string): Promise<boolean> => {
    try {
      const plan = plans.find((p) => p.id === id);
      if (!plan) return false;

      const updatedPlan = { published: !plan.published };
      const response = await fetch(`/api/plans/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlan),
      });

      if (!response.ok) return false;

      const newPlans = plans.map((p) => (p.id === id ? { ...p, published: !p.published } : p));
      setPlans(newPlans);
      
      // Notificar al componente padre si se proporciona onPlanUpdate
      if (onPlanUpdate) {
        onPlanUpdate({ ...plan, published: !plan.published });
      }
      
      return true;
    } catch {
      return false;
    }
  };

  const deletePlan = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) return false;

      const planToDelete = plans.find(p => p.id === id);
      setPlans(plans.filter((p) => p.id !== id));
      
      // Notificar al componente padre si se proporciona onPlanUpdate
      if (onPlanUpdate && planToDelete) {
        onPlanUpdate(planToDelete);
      }
      
      return true;
    } catch {
      return false;
    }
  };

  // Función para generar un alias único basado en el título
  const generateUniqueAlias = (title: string): string => {
    // Convertir el título a un formato de alias (minúsculas, sin espacios, sin caracteres especiales)
    const baseAlias = title
      .toLowerCase()
      .normalize('NFD') // Normalizar acentos
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos con guiones
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
    
    // Añadir un timestamp para garantizar unicidad
    const timestamp = Date.now().toString().slice(-6);
    const uniqueAlias = `${baseAlias}-${timestamp}`;
    
    return uniqueAlias;
  };

  const duplicatePlan = async (id: string): Promise<Plan | null> => {
    try {
      const planToDuplicate = plans.find((p) => p.id === id);
      if (!planToDuplicate) return null;
      
      // Crear una copia del plan con un nuevo ID, título y alias único
      const duplicatedPlan = {
        ...planToDuplicate,
        id: crypto.randomUUID(),
        mainTitle: `${planToDuplicate.mainTitle} (Copia)`,
        articleAlias: generateUniqueAlias(`${planToDuplicate.mainTitle} Copia`),
        published: false, // La copia siempre se crea como borrador
        createdAt: new Date().toISOString(), // Actualizar la fecha de creación
      };

      // Asegurarnos de que priceOptions sea un array
      if (!Array.isArray(duplicatedPlan.priceOptions)) {
        duplicatedPlan.priceOptions = [];
      }

      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatedPlan),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta del servidor:", errorData);
        return null;
      }

      const savedPlan = await response.json();
      
      // Actualizar el estado con el nuevo plan
      setPlans(prevPlans => [...prevPlans, savedPlan]);
      
      // Notificar al componente padre si se proporciona onPlanUpdate
      if (onPlanUpdate) {
        onPlanUpdate(savedPlan as Plan);
      }
      
      // Recargar todos los planes para asegurarnos de tener la lista actualizada
      await fetchPlans();
      
      return savedPlan as Plan;
    } catch (error) {
      console.error("Error al duplicar el plan:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    isLoading,
    error,
    togglePublished,
    deletePlan,
    duplicatePlan,
    refreshPlans: fetchPlans
  };
}
