'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentTypeHeaderProps {
  mode: 'create' | 'edit';
  isPending: boolean;
  onSubmit: () => void;
}

export function ContentTypeHeader({ mode, isPending, onSubmit }: ContentTypeHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Link 
          href="/admin/dashboard/content-types"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Volver</span>
        </Link>
        <div className="w-px h-6 bg-gray-300" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Editar Tipo de Contenido' : 'Nuevo Tipo de Contenido'}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === 'edit' ? 'Modifica la estructura de tu contenido personalizado' : 'Diseña la estructura de tu contenido flexible'}
          </p>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
      >
        {isPending ? 'Guardando...' : (mode === 'edit' ? 'Actualizar' : 'Crear')}
      </Button>
    </div>
  );
}
