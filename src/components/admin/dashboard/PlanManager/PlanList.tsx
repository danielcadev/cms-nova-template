'use client';


import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import type { Plan } from '@/types/form';
import { DeletePlanButton } from '@/components/templates/TouristPlan/components/DeletePlanButton';
import { DuplicatePlanButton } from '@/components/templates/TouristPlan/components/DuplicatePlanButton';
import { cn } from '@/lib/utils';

interface PlanListProps {
  plans: Plan[];
  togglePublished: (id: string, currentState: boolean) => void;
  deletePlan: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<Plan | null>;
}

// Componente para los botones de acción
function ActionButtons({ 
  planId, 
  planTitle,
  categoryAlias, 
  articleAlias,
  onDelete,
  onDuplicate
}: { 
  planId: string;
  planTitle: string;
  categoryAlias: string;
  articleAlias: string;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<Plan | null>;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      <Link key={`edit-link-${planId}`} href={`/admin/dashboard/plans/edit/${planId}`}>
        <Button 
          key={`edit-button-${planId}`}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 rounded-xl border-gray-200 hover:border-teal-500 hover:text-teal-600"
        >
          <Edit2 key={`edit-icon-${planId}`} className="h-4 w-4" />
          <span key={`edit-text-${planId}`}>Editar</span>
        </Button>
      </Link>
      <Link 
        key={`view-link-${planId}`}
        href={`/Planes/${categoryAlias}/${articleAlias}`} 
        target="_blank"
      >
        <Button 
          key={`view-button-${planId}`}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 rounded-xl border-gray-200 hover:border-blue-500 hover:text-blue-600"
        >
          <ExternalLink key={`view-icon-${planId}`} className="h-4 w-4" />
          <span key={`view-text-${planId}`}>Ver</span>
        </Button>
      </Link>
      <DuplicatePlanButton
        key={`duplicate-button-${planId}`}
        planId={planId}
        planTitle={planTitle}
        onDuplicate={onDuplicate}
      />
      <DeletePlanButton 
        key={`delete-button-${planId}`}
        planId={planId} 
        planTitle={planTitle}
        onDelete={onDelete}
      />
    </div>
  );
}

// Componente para el estado de publicación
function PublicationStatus({ isPublished }: { isPublished: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
      isPublished 
        ? "bg-green-50 text-green-700 border border-green-200" 
        : "bg-amber-50 text-amber-700 border border-amber-200"
    )}>
      {isPublished ? (
        <div key="published-status" className="flex items-center gap-1.5">
          <CheckCircle key="published-icon" className="h-3.5 w-3.5" />
          <span key="published-text">Publicado</span>
        </div>
      ) : (
        <div key="draft-status" className="flex items-center gap-1.5">
          <XCircle key="draft-icon" className="h-3.5 w-3.5" />
          <span key="draft-text">Borrador</span>
        </div>
      )}
    </div>
  );
}

export function PlanList({ plans, togglePublished, deletePlan, duplicatePlan }: PlanListProps) {
  return (
    <div className="grid gap-6">
      {plans.map((plan, index) => {
        // Generar un ID único para cada plan basado en su ID y posición
        const planKey = `plan-${plan.id}-${index}`;
        
        return (
          <div
            key={planKey}
            className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div key={`content-${planKey}`} className="flex items-center justify-between flex-wrap gap-4">
              <div key={`left-content-${planKey}`} className="flex items-center gap-5">
                {/* Miniatura de imagen */}
                <div key={`image-container-${planKey}`} className="relative h-16 w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                  {plan.mainImage?.url ? (
                    <Image
                      key={`image-${planKey}`}
                      src={plan.mainImage.url}
                      alt={plan.mainTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div key={`no-image-${planKey}`} className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>
                
                <div key={`info-${planKey}`} className="space-y-2">
                  <h3 key={`title-${planKey}`} className="text-xl font-semibold text-gray-900">
                    {plan.mainTitle}
                  </h3>
                  <div key={`tags-${planKey}`} className="flex items-center gap-3 flex-wrap">
                    <span key={`destination-${planKey}`} className="text-gray-500">{plan.destination}</span>
                    <span key={`category-${planKey}`} className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium border border-blue-100">
                      {plan.categoryAlias}
                    </span>
                    <PublicationStatus key={`status-${planKey}`} isPublished={plan.published} />
                  </div>
                </div>
              </div>
              
              <div key={`right-content-${planKey}`} className="flex items-center gap-6 flex-wrap">
                <div key={`switch-container-${planKey}`} className="flex items-center gap-2">
                  <span key={`switch-label-${planKey}`} className="text-sm text-gray-500">
                    {plan.published ? 'Publicado' : 'Borrador'}
                  </span>
                  <Switch
                    key={`switch-${planKey}`}
                    defaultChecked={plan.published}
                    onCheckedChange={() => togglePublished(plan.id, plan.published)}
                    className="data-[state=checked]:bg-teal-500"
                  />
                </div>

                <ActionButtons 
                  key={`action-buttons-${planKey}`}
                  planId={plan.id}
                  planTitle={plan.mainTitle}
                  categoryAlias={plan.categoryAlias}
                  articleAlias={plan.articleAlias}
                  onDelete={deletePlan}
                  onDuplicate={duplicatePlan}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
