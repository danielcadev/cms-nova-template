'use client';

import { useState } from 'react';
import { Database, Layers, Settings, Plus, RefreshCw } from 'lucide-react';

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string | null;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface ContentTypesPageContentProps {
  contentTypes: ContentType[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredContentTypes: ContentType[];
  onRefresh: () => void;
}

export function ContentTypesPageContent({
  loading,
  error,
  filteredContentTypes,
  onRefresh
}: ContentTypesPageContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Cargando tipos de contenido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="text-red-500 text-center mb-4">
              <Database className="h-8 w-8 mx-auto mb-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">Error al cargar</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const displayContentTypes = filteredContentTypes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Editorial header */}
          <div className="mb-16">
            <div className="flex items-start justify-between mb-12">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                  Tipos de Contenido
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">
                  Define y gestiona las estructuras de datos para tu contenido
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`h-4 w-4 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                    {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                  </div>
                </button>
                <a href="/admin/dashboard/content-types/create" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                  Nuevo tipo
                </a>
              </div>
            </div>
          </div>

          {/* Editorial Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{displayContentTypes.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tipos activos</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{displayContentTypes.reduce((acc, ct) => acc + (ct.fields?.length || 0), 0)}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Campos totales</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">12</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Entradas creadas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Types grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayContentTypes.map((contentType) => (
              <div key={contentType.id} className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                        {contentType.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md inline-block">
                        {contentType.apiIdentifier}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    {contentType.description || 'Tipo de contenido personalizado'}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{contentType.fields?.length || 0} campos definidos</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contentType.fields?.slice(0, 3).map((field, fieldIndex) => {
                        const fieldName = field.label || field.apiIdentifier || 'Campo';
                        return (
                          <span key={fieldIndex} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md font-medium">
                            {fieldName}
                          </span>
                        );
                      })}
                      {contentType.fields && contentType.fields.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md font-medium">
                          +{contentType.fields.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full font-medium">
                      Activo
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <a href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`} className="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 text-sm font-medium text-blue-700 dark:text-blue-300">
                        <Database className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Contenido
                      </a>
                      <a href={`/admin/dashboard/content-types/edit/${contentType.id}`} className="inline-flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Settings className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Configurar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {displayContentTypes.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                  <Database className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  No hay tipos de contenido
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Crea tu primer tipo de contenido para comenzar a estructurar tu información
                </p>
                
                <a href="/admin/dashboard/content-types/create" className="inline-flex items-center bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Crear tipo de contenido
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}