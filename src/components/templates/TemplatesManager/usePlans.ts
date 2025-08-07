'use client';

import { useState, useEffect } from 'react';

interface Plan {
  id: string;
  mainTitle: string;
  destination: string;
  published: boolean;
  createdAt: string | Date;
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/plans');
        
        if (response.ok) {
          const data = await response.json();
          setPlans(data.plans || []);
        } else {
          setError('Error al cargar los planes');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const refreshPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/plans');
      
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      } else {
        setError('Error al cargar los planes');
      }
    } catch (err) {
      console.error('Error refreshing plans:', err);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plans,
    isLoading,
    error,
    refreshPlans
  };
}
