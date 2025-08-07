'use client';

/**
 * NOVA CMS - TEMPLATES PAGE CONTENT COMPONENT (MODULARIZED)
 * =========================================================
 * 
 * Componente principal del sistema de plantillas predefinidas
 * con diseño iOS moderno y navegación mejorada.
 * 
 * MODULARIZADO: Este componente ahora usa subcomponentes para mayor claridad.
 */

import { TemplatesHero } from './TemplatesHero';
import { TemplatesGrid } from './TemplatesGrid';
import { TouristPlansView } from './TouristPlansView';

interface Plan {
  id: string;
  mainTitle: string;
  destination: string;
  published: boolean;
  createdAt: string | Date;
}

interface TemplatesPageContentProps {
  selectedTemplate: string | null;
  onSelectTemplate: (template: string | null) => void;
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

export function TemplatesPageContent({
  selectedTemplate,
  onSelectTemplate,
  plans,
  isLoading,
  error
}: TemplatesPageContentProps) {
  
  // Vista principal - selección de plantillas
  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <TemplatesHero />
          <TemplatesGrid onSelectTemplate={onSelectTemplate} />
        </div>
      </div>
    );
  }

  // Vista de planes turísticos
  if (selectedTemplate === 'tourist-plan') {
    return (
      <TouristPlansView 
        plans={plans}
        isLoading={isLoading}
        error={error}
        onBack={() => onSelectTemplate(null)}
      />
    );
  }

  return null;
}

