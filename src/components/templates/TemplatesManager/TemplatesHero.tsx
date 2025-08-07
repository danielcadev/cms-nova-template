'use client';

import { FileText } from 'lucide-react';

export function TemplatesHero() {
  return (
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/20 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-600">Sistema de Plantillas</span>
      </div>
      
      <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
        Plantillas Predefinidas
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Selecciona un tipo de contenido especializado para crear rápidamente con estructuras optimizadas y campos predefinidos.
      </p>
    </div>
  );
}
