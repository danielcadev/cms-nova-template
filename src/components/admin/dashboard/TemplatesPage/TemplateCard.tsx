'use client';

import { 
  MoreHorizontal,
  Eye,
  Settings,
  Calendar,
  Tag,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { Template } from './index';

interface TemplateCardProps {
  template: Template;
  index: number;
  onViewDetails: (template: Template) => void;
}

export function TemplateCard({ template, index, onViewDetails }: TemplateCardProps) {
  const IconComponent = template.icon;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'coming-soon':
        return 'bg-amber-500';
      case 'draft':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Disponible';
      case 'coming-soon':
        return 'Próximamente';
      case 'draft':
        return 'Borrador';
      default:
        return 'Desconocido';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
      case 'coming-soon':
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  const CardContent = () => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 hover:border-gray-300 dark:hover:border-gray-700">
      
      {/* Header with icon and info */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <IconComponent className="h-6 w-6" strokeWidth={1.5} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {template.name}
              </h3>
              <div className={cn(
                "w-2 h-2 rounded-full",
                getStatusColor(template.status)
              )} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {template.category}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Template description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
        {template.description}
      </p>

      {/* Template info */}
      <div className="space-y-3 mb-6">
        {template.contentCount !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Contenidos</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {template.contentCount}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Categoría</span>
          </div>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {template.category}
          </span>
        </div>

        {/* Solo mostrar fecha si realmente existe y no es coming-soon */}
        {template.createdAt && template.status !== 'coming-soon' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Creación</span>
            </div>
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {new Date(template.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
        
        {/* Para plantillas próximamente, mostrar estado en lugar de fecha */}
        {template.status === 'coming-soon' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
            </div>
            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              En desarrollo
            </span>
          </div>
        )}
      </div>

      {/* Status and action buttons */}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusBadgeClass(template.status)}`}>
          {getStatusText(template.status)}
        </span>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewDetails(template);
            }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" strokeWidth={1.5} />
              <span>Detalles</span>
            </div>
          </button>
          
          {template.status === 'active' && template.route && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              <span>Abrir</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {template.status === 'active' && template.route ? (
        <Link href={template.route}>
          <CardContent />
        </Link>
      ) : (
        <div onClick={() => onViewDetails(template)}>
          <CardContent />
        </div>
      )}
    </div>
  );
}