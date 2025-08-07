// src/components/admin/plans/PlanManager/index.tsx
'use client';

import { AlertCircle, CheckCircle, FileText, XCircle } from 'lucide-react';
import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { PlanManagerSkeleton } from './PlanManagerSkeleton';
import { usePlans } from '@/hooks/usePlans';
import type { PlanManagerProps, Plan } from '@/types/form';
import { Header } from './Header';
import { EmptyState } from './EmptyState';
import { PlanList } from './PlanList';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';

// Componente de Error
const ErrorMessage = memo(function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-3 p-8 bg-rose-50/50 backdrop-blur-sm text-rose-900 rounded-3xl border border-rose-200">
        <AlertCircle className="h-8 w-8" />
        <p className="text-xl font-medium">{message}</p>
      </div>
    </div>
  );
});

// Componente de estadísticas
const StatsPanel = memo(function StatsPanel({ 
  totalPlans, 
  publishedPlans, 
  draftPlans 
}: { 
  totalPlans: number;
  publishedPlans: number;
  draftPlans: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total de planes</p>
          <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
        <div className="p-3 rounded-lg bg-green-50 text-green-600">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Publicados</p>
          <p className="text-2xl font-bold text-gray-900">{publishedPlans}</p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
        <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Borradores</p>
          <p className="text-2xl font-bold text-gray-900">{draftPlans}</p>
        </div>
      </div>
    </div>
  );
});

export const PlanManager = memo(function PlanManager({ 
  onPlanUpdate 
}: PlanManagerProps) {
  const router = useRouter();
  
  // Callback para actualizar la interfaz después de modificar un plan
  const handlePlanUpdate = useCallback((plan: Plan) => {
    // Forzar una actualización de la interfaz
    router.refresh();
    
    // Llamar al callback onPlanUpdate si existe
    if (onPlanUpdate) {
      onPlanUpdate(plan);
    }
  }, [router, onPlanUpdate]);
  
  const { 
    plans, 
    isLoading, 
    error, 
    togglePublished,
    deletePlan: deletePlanHook,
    duplicatePlan: duplicatePlanHook,
    refreshPlans
  } = usePlans(handlePlanUpdate);

  // Adaptador para deletePlan para que coincida con el tipo esperado por PlanList
  const deletePlan = useCallback(async (id: string): Promise<void> => {
    await deletePlanHook(id);
  }, [deletePlanHook]);

  // Adaptador para duplicatePlan que asegura que la interfaz se actualice
  const duplicatePlan = useCallback(async (id: string): Promise<Plan | null> => {
    const result = await duplicatePlanHook(id);
    
    // Forzar una actualización de la interfaz después de duplicar
    if (result) {
      // Usamos setTimeout para asegurarnos de que la actualización ocurra después de que el estado se haya actualizado
      setTimeout(() => {
        refreshPlans();
        router.refresh();
      }, 100);
    }
    
    return result;
  }, [duplicatePlanHook, refreshPlans, router]);

  // Recargar los planes cuando el componente se monta
  useEffect(() => {
    refreshPlans();
  }, [refreshPlans]);

  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Estadísticas
  const stats = useMemo(() => {
    if (!plans) return { total: 0, published: 0, draft: 0 };
    
    const published = plans.filter(plan => plan.published).length;
    return {
      total: plans.length,
      published,
      draft: plans.length - published
    };
  }, [plans]);

  // Filtrar y ordenar planes
  const filteredPlans = useMemo(() => {
    if (!plans) {
      return [];
    }
    
    // Primero filtrar por estado de publicación
    let filtered = [...plans];
    if (publishedFilter === 'published') {
      filtered = filtered.filter(plan => plan.published);
    } else if (publishedFilter === 'draft') {
      filtered = filtered.filter(plan => !plan.published);
    }
    
    // Luego filtrar por término de búsqueda
    if (debouncedSearchTerm.trim()) {
      const searchTerms = debouncedSearchTerm.toLowerCase().split(' ');
      
      filtered = filtered.filter(plan => {
        const searchableText = `
          ${plan.mainTitle}
          ${plan.destination}
          ${plan.categoryAlias}
          ${plan.promotionalText}
        `.toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    }
    
    // Ordenar los resultados
    const result = filtered.sort((a, b) => {
      // Si hay término de búsqueda, priorizar coincidencias exactas
      if (debouncedSearchTerm.trim()) {
        const aTitle = a.mainTitle.toLowerCase();
        const bTitle = b.mainTitle.toLowerCase();
        const aDestination = a.destination.toLowerCase();
        const bDestination = b.destination.toLowerCase();
        
        const aExactMatch = aTitle.includes(debouncedSearchTerm.toLowerCase()) || 
                          aDestination.includes(debouncedSearchTerm.toLowerCase());
        const bExactMatch = bTitle.includes(debouncedSearchTerm.toLowerCase()) || 
                          bDestination.includes(debouncedSearchTerm.toLowerCase());
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
      }
      
      // Por defecto, ordenar por fecha de creación (más recientes primero)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return result;
  }, [plans, debouncedSearchTerm, publishedFilter]);

  if (isLoading) return <PlanManagerSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      <div className="container mx-auto py-16 px-4 space-y-8">
        <Header 
          onSearch={setSearchTerm} 
          onFilterChange={setPublishedFilter}
        />
        
        <StatsPanel 
          totalPlans={stats.total}
          publishedPlans={stats.published}
          draftPlans={stats.draft}
        />
        
        <div>
          {filteredPlans.length === 0 ? (
            searchTerm || publishedFilter !== 'all' ? (
              <EmptyState 
                title="No se encontraron resultados"
                description="Intenta con otros términos de búsqueda o filtros"
              />
            ) : (
              <EmptyState />
            )
          ) : (
            <PlanList 
              plans={filteredPlans} 
              togglePublished={togglePublished}
              deletePlan={deletePlan}
              duplicatePlan={duplicatePlan}
            />
          )}
        </div>
      </div>
    </div>
  );
});
