'use client';

import { Puzzle } from 'lucide-react';
import { Plugin } from '@/lib/plugins/config';
import { PluginsHeader } from './PluginsHeader';
import { PluginsGrid } from './PluginsGrid';
import { PluginsLoadingState } from './PluginsLoadingState';

interface PluginsPageContentProps {
  plugins: Plugin[];
  isLoading: boolean;
  handleTogglePlugin: (pluginId: string) => void;
  handleRefresh: () => void;
  onConfigurePlugin?: (plugin: Plugin) => void;
}

export function PluginsPageContent({
  plugins,
  isLoading,
  handleTogglePlugin,
  handleRefresh,
  onConfigurePlugin
}: PluginsPageContentProps) {
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Cargando extensiones...</p>
          </div>
        </div>
      </div>
    );
  }

  const enabledCount = plugins.filter(p => p.enabled).length;
  const totalCount = plugins.length;

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
                  Plugins
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">
                  Extiende las funcionalidades de tu CMS con plugins especializados
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Puzzle className="h-4 w-4" strokeWidth={1.5} />
                    Actualizar
                  </div>
                </button>
              </div>
            </div>
          </div>
            
          {/* Editorial Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{enabledCount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Plugins activos</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{totalCount - enabledCount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Disponibles</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{totalCount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total plugins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Plugins grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{plugin.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                        {plugin.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        v{plugin.version} • {plugin.author}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${plugin.enabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {plugin.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    plugin.enabled 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {plugin.enabled ? 'Activo' : 'Inactivo'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {plugin.configurable && (
                      <button 
                        onClick={() => onConfigurePlugin?.(plugin)}
                        className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 font-medium text-gray-700 dark:text-gray-300"
                      >
                        Configurar
                      </button>
                    )}
                    <button 
                      onClick={() => handleTogglePlugin(plugin.id)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                        plugin.enabled
                          ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                          : 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {plugin.enabled ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {plugins.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                  <Puzzle className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  No hay plugins disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Los plugins te permiten extender las funcionalidades de tu CMS
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
