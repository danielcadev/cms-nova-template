'use client';

import React from 'react';
import { useSectionAutosave } from '@/hooks/use-section-autosave';
import { Save } from 'lucide-react';
import { type PlanFormValues } from '@/schemas/plan';

interface AutosaveSectionProps {
  planId?: string;
  sectionName: string;
  fields?: (keyof PlanFormValues)[];
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export function AutosaveSection({
  planId,
  sectionName,
  fields,
  delay = 3000,
  children,
  className = ''
}: AutosaveSectionProps) {
  const { isAutosaving } = useSectionAutosave({
    planId,
    fields,
    delay,
    enabled: !!planId,
  });

  return (
    <div className={`relative ${className}`}>
      {/* Indicador de autosave flotante */}
      {isAutosaving && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm border border-blue-200">
          <Save className="h-3 w-3 animate-pulse" />
          <span>Guardando {sectionName}...</span>
        </div>
      )}
      
      {children}
    </div>
  );
}

// Hook simplificado para usar en componentes individuales
export function useAutoSave(options: {
  planId?: string;
  fields?: (keyof PlanFormValues)[];
  delay?: number;
}) {
  return useSectionAutosave({
    ...options,
    enabled: !!options.planId,
  });
}
