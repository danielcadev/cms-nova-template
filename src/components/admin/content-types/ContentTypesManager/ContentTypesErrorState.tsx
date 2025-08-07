'use client';

import { Database } from 'lucide-react';

interface ContentTypesErrorStateProps {
  error: string;
}

export function ContentTypesErrorState({ error }: ContentTypesErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Database className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar tipos de contenido</h3>
      <p className="text-red-700">{error}</p>
    </div>
  );
}
