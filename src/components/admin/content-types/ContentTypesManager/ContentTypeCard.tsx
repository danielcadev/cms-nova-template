'use client';

import { 
  Database,
  Calendar,
  Eye,
  Edit,
  Layers,
  FileText,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface ContentTypeCardProps {
  contentType: ContentType;
  index: number;
}

export function ContentTypeCard({ contentType, index }: ContentTypeCardProps) {
  return (
    <div
      className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 p-8 overflow-hidden hover:scale-[1.02] hover:-translate-y-1">
        
        {/* Efectos de luz internos */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/3 via-transparent to-[#BF5AF2]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        <div className="relative">
          {/* Header con badge flotante */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0A84FF] to-[#64D2FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0A84FF]/20 group-hover:shadow-xl group-hover:shadow-[#0A84FF]/30 transition-all duration-500">
                  <Database className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A84FF] to-[#64D2FF] rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[#1C1C1E] group-hover:text-[#0A84FF] transition-colors duration-300 mb-1">
                  {contentType.name}
                </h3>
                <p className="text-sm text-[#8E8E93] font-mono bg-[#F2F2F7]/60 px-2 py-1 rounded-lg">
                  {contentType.apiIdentifier}
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl px-3 py-1.5 shadow-sm">
              <span className="text-xs font-bold text-[#0A84FF]">
                {contentType.fields.length} campo{contentType.fields.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Descripción elegante */}
          {contentType.description && (
            <div className="mb-8">
              <p className="text-[#2C2C2E] leading-relaxed font-medium line-clamp-2">
                {contentType.description}
              </p>
            </div>
          )}

          {/* Fields con diseño sofisticado */}
          {contentType.fields.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {contentType.fields.slice(0, 4).map((field, idx) => (
                  <div key={field.id} className="relative">
                    <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <span className="text-xs font-medium text-[#2C2C2E]">{field.label}</span>
                    </div>
                  </div>
                ))}
                {contentType.fields.length > 4 && (
                  <div className="bg-[#E5E5EA]/70 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 shadow-sm">
                    <span className="text-xs font-medium text-[#8E8E93]">
                      +{contentType.fields.length - 4} más
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata con iconos */}
          <div className="flex items-center justify-between mb-8 text-xs text-[#8E8E93]">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" strokeWidth={1.5} />
              <span>{new Date(contentType.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Layers className="h-3 w-3" strokeWidth={1.5} />
              <span>Actualizado {new Date(contentType.updatedAt).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
          
          {/* Botones flotantes */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Link href={`/admin/dashboard/content-types/edit/${contentType.id}`} className="flex-1">
              <button className="w-full px-4 py-2.5 bg-[#0A84FF]/10 backdrop-blur-sm text-[#0A84FF] rounded-2xl hover:bg-[#0A84FF]/20 transition-all font-medium text-sm border border-[#0A84FF]/20 hover:border-[#0A84FF]/30 shadow-sm hover:shadow-md">
                <Edit className="h-4 w-4 inline mr-2" strokeWidth={1.5} />
                Editar
              </button>
            </Link>
            <Link href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}>
              <button className="px-4 py-2.5 bg-[#30D158]/10 backdrop-blur-sm text-[#30D158] rounded-2xl hover:bg-[#30D158]/20 transition-all font-medium text-sm border border-[#30D158]/20 hover:border-[#30D158]/30 shadow-sm hover:shadow-md">
                <Eye className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </Link>
            <button className="px-4 py-2.5 bg-[#FF3B30]/10 backdrop-blur-sm text-[#FF3B30] rounded-2xl hover:bg-[#FF3B30]/20 transition-all font-medium text-sm border border-[#FF3B30]/20 hover:border-[#FF3B30]/30 shadow-sm hover:shadow-md">
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
