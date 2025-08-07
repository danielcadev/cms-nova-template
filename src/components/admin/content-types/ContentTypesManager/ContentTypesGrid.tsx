'use client';

import { Database, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContentTypeCard } from './ContentTypeCard';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface ContentTypesGridProps {
  contentTypes: ContentType[];
  searchTerm: string;
}

export function ContentTypesGrid({ contentTypes, searchTerm }: ContentTypesGridProps) {
  if (contentTypes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block mb-12">
          {/* Contenedor principal con glassmorphism */}
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-xl shadow-black/5">
            {/* Efectos de luz */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/5 via-transparent to-[#BF5AF2]/3 rounded-3xl" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            {/* Icono con glow */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#8E8E93]/10 to-[#8E8E93]/5 rounded-3xl flex items-center justify-center mb-6 border border-white/30">
                <Database className="w-12 h-12 text-[#8E8E93]" strokeWidth={1.5} />
              </div>
              
              {/* Círculos decorativos */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#0A84FF]/20 to-[#64D2FF]/10 rounded-full blur-sm" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-[#BF5AF2]/20 to-[#0A84FF]/10 rounded-full blur-sm" />
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h3 className="text-3xl font-bold text-[#1C1C1E] mb-6 tracking-tight">
            {searchTerm ? 'Sin resultados' : 'Comienza aquí'}
          </h3>
          <p className="text-lg text-[#8E8E93] mb-10 leading-relaxed font-light">
            {searchTerm 
              ? 'Ajusta los términos de búsqueda para encontrar el contenido que necesitas.'
              : 'Crea tu primer tipo de contenido y define la estructura de datos perfecta para tu aplicación.'
            }
          </p>
          
          {!searchTerm && (
            <Link href="/admin/dashboard/content-types/create">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] text-white rounded-2xl font-semibold shadow-lg shadow-[#0A84FF]/20 hover:shadow-xl hover:shadow-[#0A84FF]/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" strokeWidth={2} />
                  <span>Crear Primer Tipo</span>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {contentTypes.map((contentType, index) => (
        <ContentTypeCard
          key={contentType.id}
          contentType={contentType}
          index={index}
        />
      ))}
    </div>
  );
}
