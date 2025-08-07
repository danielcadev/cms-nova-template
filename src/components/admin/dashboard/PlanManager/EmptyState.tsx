// src/components/admin/plans/PlanManager/components/EmptyState.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

export function EmptyState({ 
  title = "No hay planes creados",
  description = "Comienza creando tu primer plan turístico",
  showCreateButton = true
}: EmptyStateProps) {
  return (
    <div
      className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl"
    >
      <div className="relative flex flex-col items-center justify-center min-h-[400px] p-20 text-center">
        <div className="p-6 rounded-full bg-gray-50 mb-8">
          <Package className="h-20 w-20 text-gray-400" />
        </div>
        <div className="max-w-md space-y-4">
          <h3 className="text-3xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="text-xl text-gray-500">
            {description}
          </p>
          {showCreateButton && (
            <div
              className="pt-8"
            >
              <Link href="/admin/dashboard/plans/create">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-3 text-lg px-8 py-6 h-auto rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 mx-auto"
                >
                  <Plus className="h-6 w-6" />
                  Crear tu primer plan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
