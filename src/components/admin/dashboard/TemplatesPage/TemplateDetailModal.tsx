'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Calendar, 
  Tag, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Edit,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Template } from './index';

interface TemplateDetailModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateDetailModal({ template, isOpen, onClose }: TemplateDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  if (!isOpen || !template) return null;
  
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

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulación de eliminación
    setTimeout(() => {
      setIsDeleting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <IconComponent className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{template.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{template.category}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(template.status)}`} />
              <span className={`text-sm px-2 py-1 rounded font-medium ${getStatusBadgeClass(template.status)}`}>
                {getStatusText(template.status)}
              </span>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Descripción</h3>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {template.description}
              </p>
            </div>
            
            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Detalles</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Categoría</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {template.category}
                    </span>
                  </div>
                  
                  {template.createdAt && (
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
                  
                  {template.updatedAt && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Actualización</span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(template.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Compatibilidad</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Contenido web</span>
                    </div>
                    <span className="text-sm text-emerald-500 font-medium">Compatible</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                    </div>
                    <span className="text-sm text-emerald-500 font-medium">Compatible</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Móvil</span>
                    </div>
                    <span className="text-sm text-amber-500 font-medium">Parcial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            {template.status === 'active' && (
              <Button
                variant="default"
                className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
                onClick={() => {
                  // Navegar a la página de creación según el tipo de plantilla
                  if (template.category === 'Turismo') {
                    router.push('/admin/dashboard/templates/tourism/create');
                  } else {
                    // Para otras plantillas, navegar a una página genérica
                    router.push('/admin/dashboard/templates/create');
                  }
                  onClose(); // Cerrar el modal después de navegar
                }}
              >
                Usar plantilla
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              <Copy className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Duplicar
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
              onClick={() => {
                // Navegar a la página de edición según el tipo de plantilla
                if (template.category === 'Turismo') {
                  router.push('/admin/dashboard/templates/tourism');
                } else {
                  router.push('/admin/dashboard/templates');
                }
                onClose(); // Cerrar el modal después de navegar
              }}
            >
              <Edit className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Editar
            </Button>
            
            <Button
              variant="outline"
              className="border-red-300 hover:border-red-400 text-red-600 hover:text-red-700 dark:border-red-900 dark:hover:border-red-800 dark:text-red-500 dark:hover:text-red-400"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-200 border-t-red-600 dark:border-red-900 dark:border-t-red-500 mr-2"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-2" strokeWidth={1.5} />
              )}
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}